using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using StudentBloodBank.ADOLayer;
using StudentBloodBank.Model;
using StudentBloodBank.Enums;  
using StudentBloodBank.DTOLayer;
using System.Collections.Generic;
using System.Runtime.Intrinsics.X86;
using System.Reflection.PortableExecutable;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMasterController : ControllerBase
    {

        [HttpGet("GetUserDetails")]
        public IActionResult GetUserDetails()
        {
            try
            {
                List<GetUserDetailsDto> users = new List<GetUserDetailsDto>();

                using (SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("GetUser"))
                {
                    while (reader.Read())
                    {
                        UserRole.UserRoles use = (UserRole.UserRoles)reader.GetInt32(6);

                        users.Add(new GetUserDetailsDto
                        {
                            UserId = reader.GetInt32(0),
                            UserName = reader.GetString(1),
                            Email = reader.GetString(2),
                            Password = reader.GetString(3),
                            BloodGroup = reader.GetString(4),
                            Contact = reader.GetString(5),
                            Role = use.ToString(),
                            AddressId = reader.GetInt32(7),
                            Collegeid = reader.IsDBNull(8) ? (int?)null : reader.GetInt32(8),
                            CreatedDateTime = reader.GetDateTime(9)

                           
                        });
                    }
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpPost("PostDetails")]
        public IActionResult PostDetails([FromBody] UserMaster user)
        {
            try
            {
                if (user == null)
                    return BadRequest("User data is null.");

                string storedProcedureName = "RegisterUser";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@Name", user.UserName),
                    new SqlParameter("@Email", user.Email),
                    new SqlParameter("@Password", user.Password),
                    new SqlParameter("@BloodGroup", user.BloodGroup),
                    new SqlParameter("@Contact", user.Contact),
                    new SqlParameter("@Role", user.Role), 
                    new SqlParameter("@AddressID", user.AddressId),
                    new SqlParameter("@CollegeID", user.Collegeid)
                };

                AdoDataLayer.GetReaderDataFromQuery(storedProcedureName, parameters);
                return Ok("Saved");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet("UserLoginByEmail")]
        public IActionResult GetFromEmailAndPassword(string Email, string Password)
        {
            try
            {

                List<UserMaster> users = new List<UserMaster>();
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@Password", Password),
                    new SqlParameter("@Email", Email)
                };

                using (SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("UserLogin", parameters))
                {

                    while (reader.Read())
                    {
                        UserRole.UserRoles use = (UserRole.UserRoles)reader.GetInt32(6);
                        users.Add(new UserMaster
                        {
                            UserId = reader.GetInt32(0),  
                            UserName = reader.GetString(1), 
                            Email =  reader.GetString(2), 
                            Password =  reader.GetString(3),
                            BloodGroup =  reader.GetString(4),  
                            Contact = reader.GetString(5), 
                            Role = use.ToString(),
                            CreatedDateTime = reader.GetDateTime(9),
                            Locality = reader.GetString(10),
                            Area=reader.GetString(11),
                            Collegeid=reader.GetInt32(8),
                            AddressId=reader.GetInt32(7)
                        });
                    }
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("GetUserById/{id}")]
        public IActionResult GetUserById(int id)
        {
            try
            {
                List<UserMaster> users = new List<UserMaster>();
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@UserId", id)
                };
                AddressMasterl obj = new AddressMasterl();

                using (SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("GetUserById", parameters))
                {
                    while (reader.Read())
                    {
                        UserRole.UserRoles use = (UserRole.UserRoles)reader.GetInt32(6);
                        users.Add(new UserMaster
                        {
                            UserId = reader.GetInt32(0),
                            UserName = reader.GetString(1),
                            Email = reader.GetString(2),
                            Password = reader.GetString(3),
                            BloodGroup = reader.GetString(4),
                            Contact = reader.GetString(5),
                            Role = use.ToString(),
                            AddressId = reader.GetInt32(7),
                            Collegeid = reader.GetInt32(8),
                            CreatedDateTime = reader.GetDateTime(9),
                            Locality = reader.GetString(10),
                            Area = reader.GetString(11),
                            CollegeName=reader.GetString(12)
                        });
                    }
                }
                if(users.Count > 0)
                {
                    return Ok(users[0]);
                }
                else
                {
                    return BadRequest("User Not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
