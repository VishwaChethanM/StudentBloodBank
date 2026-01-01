using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using StudentBloodBank.ADOLayer;
using StudentBloodBank.Model;
using StudentBloodBank.DTOLayer; // Ensure this is present
using System.Collections.Generic;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using StudentBloodBank.Enums;
using System.Reflection.PortableExecutable;
// REMOVED: using static StudentBloodBank.DTOLayer.UserProfileUpdateModel; // This line was removed

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMasterController : ControllerBase
    {
        private readonly AdoDataLayer _adoDataLayer;

        public UserMasterController(AdoDataLayer adoDataLayer)
        {
            _adoDataLayer = adoDataLayer;
        }

        [HttpGet("GetUserDetails")]
        public IActionResult GetUserDetails()
        {
            try
            {
                List<GetUserDetailsDto> users = new List<GetUserDetailsDto>();

                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("GetUser"))
                {
                    while (reader.Read())
                    {
                        users.Add(new GetUserDetailsDto
                        {
                            UserId = reader.GetInt32(0),
                            UserName = reader.GetString(1),
                            Email = reader.GetString(2),
                            // IMPORTANT: GetUserDetailsDto has a [Required] Password field.
                            // However, you should NOT be reading a password from the database here for security reasons.
                            // If your GetUser stored procedure returns it, ensure it's hashed and handle it appropriately,
                            // or ideally, remove Password from GetUserDetailsDto if it's only for displaying user info.
                            // For now, I'm assuming the reader doesn't provide it, or you will remove it from the DTO.
                            // If GetUserDetailsDto *must* have it and your SP doesn't provide it,
                            // you might need to assign a default/empty string or mark it nullable in GetUserDetailsDto.
                            Password = string.Empty, // Placeholder or remove from DTO if not needed here
                            BloodGroup = reader.GetString(4),
                            Contact = reader.GetString(5),
                            Role = ((UserRole.UserRoles)reader.GetInt32(6)).ToString(),
                            AddressId = reader.GetInt32(7),
                            Collegeid = reader.IsDBNull(8) ? (int?)null : reader.GetInt32(8),
                            CreatedDateTime = reader.GetDateTime(9)
                            // Assuming a Status field is added at index 10, adjust if different
                            // Status = reader.IsDBNull(10) ? null : reader.GetString(10)
                        });
                    }
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("PostDetails")]
        public IActionResult PostDetails([FromBody] PostUserMasterDto user)
        {
            try
            {
                if (user == null)
                    return BadRequest("User data is null.");

                if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
                    return BadRequest("Username, Email, and Password are required.");

                //  Hash Password Before Storing
                string hashedPassword = HashPassword(user.Password);

                string storedProcedureName = "RegisterUser";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@Name", user.UserName),
                    new SqlParameter("@Email", user.Email),
                    new SqlParameter("@Password", hashedPassword),
                    new SqlParameter("@BloodGroup", user.BloodGroup),
                    new SqlParameter("@Contact", user.Contact),
                    new SqlParameter("@Role", user.Role),
                    new SqlParameter("@AddressID", user.AddressId),
                    new SqlParameter("@CollegeID", user.Collegeid ?? (object)DBNull.Value)
                };

                _adoDataLayer.ExecuteNonQuery(storedProcedureName, parameters);
                return Ok("User registered successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        //  GET: Fetch User By ID
        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            try
            {
                GetUserByIdDto user = null;

                SqlParameter[] parameters = { new SqlParameter("@UserId", id) };

                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("GetUserById", parameters))
                {
                    if (!reader.HasRows)
                        return NotFound(new { message = "User not found" });

                    while (reader.Read())
                    {
                        user = new GetUserByIdDto
                        {
                            UserId = Convert.ToInt32(reader["UserId"]),
                            Name = reader["Name"].ToString(),
                            Email = reader["Email"].ToString(),
                            BloodGroup = reader["BloodGroup"].ToString(),
                            Contact = reader["Contact"].ToString(),
                            Role = Convert.ToInt32(reader["Role"]),
                            AddressId = Convert.ToInt32(reader["AddressId"]),
                            CollegeID = reader["CollegeID"] != DBNull.Value ? Convert.ToInt32(reader["CollegeID"]) : (int?)null,
                            CreatedDate = Convert.ToDateTime(reader["CreatedDate"])
                        };
                    }
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching user: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }
        }


        [HttpPut("UpdateUser/{id}")]
        public IActionResult UpdateUserProfile(int id, [FromBody] UpdateUserDto userDto) // Changed to UpdateUserDto
        {
            if (userDto == null) // Changed 'user' to 'userDto'
                return BadRequest("Invalid user data. User object is null.");

            // Optional: You can check if the ID in the URL matches the DTO ID, though it's often redundant
            // if you strictly use the URL ID for the update target.
            // if (id != userDto.UserId)
            // {
            //     return BadRequest("User ID mismatch.");
            // }

            try
            {
                string storedProcedure = "sp_UpdateUserProfile";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@UserId", id),
                    // Pass parameters conditionally or with null coalescing for nullable properties
                    // to match your sp_UpdateUserProfile's expected parameters.
                    // Assuming sp_UpdateUserProfile parameters are nullable or handle nulls gracefully.
                    new SqlParameter("@UserName", (object)userDto.UserName ?? DBNull.Value),
                    new SqlParameter("@Email", (object)userDto.Email ?? DBNull.Value),
                    new SqlParameter("@BloodGroup", (object)userDto.BloodGroup ?? DBNull.Value),
                    new SqlParameter("@Phone", (object)userDto.Contact ?? DBNull.Value), // Mapping Contact from DTO to @Phone in SP
                    new SqlParameter("@Address", (object)userDto.AddressId ?? DBNull.Value), // Mapping AddressId from DTO to @Address in SP
                    new SqlParameter("@Role", (object)userDto.Role ?? DBNull.Value), // Include if SP updates Role
                    new SqlParameter("@CollegeID", (object)userDto.Collegeid ?? DBNull.Value), // Include if SP updates CollegeID
                    new SqlParameter("@Status", (object)userDto.Status ?? DBNull.Value) // NEW: Include Status from DTO
                };

                // You might want to log the incoming DTO and the parameters here for debugging
                Console.WriteLine($"Attempting to update user {id} with status: {userDto.Status}");
                // Optional: Log all parameters for debugging
                foreach (var param in parameters)
                {
                    Console.WriteLine($"Parameter: {param.ParameterName}, Value: {param.Value}");
                }


                int rowsAffected = _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);

                if (rowsAffected > 0)
                {
                    Console.WriteLine($"User {id} updated successfully. Rows affected: {rowsAffected}");
                    return Ok("User profile updated successfully.");
                }
                else
                {
                    Console.WriteLine($"User {id} not found or no changes made. Rows affected: {rowsAffected}");
                    return NotFound("User not found or no changes made.");
                }
            }
            catch (Exception ex)
            {
                // IMPORTANT: Enhance error logging here!
                Console.WriteLine($"Error updating user {id}: {ex.Message}");
                // Return the actual exception message to the frontend for better debugging
                return StatusCode(500, $"Internal server error: {ex.Message}. Details: {ex.InnerException?.Message}"); // Return 500 for server-side errors
            }
        }


        //  Secure Password Hashing Using PBKDF2
        private string HashPassword(string password)
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] salt = new byte[16];
                rng.GetBytes(salt);
                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
                {
                    byte[] hash = pbkdf2.GetBytes(32);
                    return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}"; // Store salt and hash together
                }
            }
        }

        //  Verify Password Using PBKDF2
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
                return CryptographicOperations.FixedTimeEquals(hash, storedHashBytes);
            }
        }
    }
}