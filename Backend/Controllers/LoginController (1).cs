using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StudentBloodBank.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Security.Cryptography;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // 🔹 Login API (POST: api/Login)
        [HttpPost]
        public IActionResult Login([FromBody] LoginDto login)
        {
            if (string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
                return BadRequest(new { message = "Email and Password are required." });

            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("UserLoginByEmail", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Email", login.Email);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            int userId = reader.GetInt32(0);
                            string userName = reader.GetString(1);
                            string email = reader.GetString(2);
                            string storedHash = reader.GetString(3); // Hashed password from DB
                            int role = reader.GetInt32(4); // 1 = Admin, 2 = User, 3 = Student
                            // 🔹 Verify Password using PBKDF2
                            if (!VerifyPassword(login.Password, storedHash))
                            {
                                return Unauthorized(new { message = "Invalid email or password." });
                            }
                            // 🔹 Generate JWT Token
                            var token = GenerateJwtToken(userId, email, role);
                            return Ok(new
                            {
                                token,
                                user = new { userId, userName, email, role }
                            });
                        }
                    }
                }
            }
            return Unauthorized(new { message = "Invalid email or password." });
        }

        // 🔹 Secure Password Verification Using PBKDF2
        private bool VerifyPassword(string enteredPassword, string storedHash)
        {
            var parts = storedHash.Split('.');
            if (parts.Length != 2)
                return false;

            byte[] salt = Convert.FromBase64String(parts[0]);
            byte[] storedHashBytes = Convert.FromBase64String(parts[1]);

            using (var pbkdf2 = new Rfc2898DeriveBytes(enteredPassword, salt, 10000, HashAlgorithmName.SHA256))
            {
                byte[] hash = pbkdf2.GetBytes(32);
                return CryptographicOperations.FixedTimeEquals(hash, storedHashBytes); // Prevents timing attacks
            }
        }

        // 🔹 Generate JWT Token (Now Includes User ID)
        private string GenerateJwtToken(int userId, string email, int role)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()), // Include User ID
                new Claim(ClaimTypes.Role, role.ToString())
            };
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}