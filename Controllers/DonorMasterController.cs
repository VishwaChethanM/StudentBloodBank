using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using StudentBloodBank.ADOLayer;
using StudentBloodBank.DTOLayer;
using StudentBloodBank.Enums;
using StudentBloodBank.Model;
using System.Data;
using System.Drawing;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonorMasterController : ControllerBase
    {

        [HttpPost("SaveCollege")]
        public IActionResult AddcollegeDetails([FromBody] DonorMaster donr)
        {
            try
            {
                String StoredProcedure = "RegisterDonor";
                SqlParameter[] parameter = new SqlParameter[]
                {
                    new SqlParameter("@userId", donr.UserId),
                    new SqlParameter("@Age", donr.Age),
                    new SqlParameter("@LastDonationDate", donr.LastDonationDate),
                    new SqlParameter("@AvailabilityStatus", donr.AvailabilityStatus)
                };
                AdoDataLayer.GetReaderDataFromQuery(StoredProcedure, parameter);
                return Ok("Saved");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }



        [HttpGet("GetAllDonors")]
        public IActionResult GetAllDonors()
        {
            List<GetAllDonorsDetailsDto> donors = new List<GetAllDonorsDetailsDto>();
            SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("GetAllDonors");

            while (reader.Read())
            {
                donors.Add(new GetAllDonorsDetailsDto
                {
                    DonorId = reader.GetInt32(0),
                    UserId = reader.GetInt32(1),
                    Age = reader.GetInt32(2),
                    LastDonationDate =reader.GetDateTime(3),
                    AvailabilityStatus = Convert.ToBoolean(reader.GetValue(4)),
                    CreatedDate = reader.GetDateTime(5),
                });
            }
            reader.Close(); 
            return Ok(donors); 
        }











        [HttpGet("GetDonorById/{id}")]
        public IActionResult GetUserById(int id)
        {
            try
            {
                List<DonorMaster> donors = new List<DonorMaster>();
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@DonorId", id)
                };

                using (SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("GetDonorById", parameters))
                {
                    while (reader.Read())
                    {
                        donors.Add(new DonorMaster
                        {
                            DonorId = (int)reader["DonorId"],
                            Age = (int)reader["Age"],
                            LastDonationDate = reader["LastDonationDate"] == DBNull.Value ? (DateTime?)null : (DateTime)reader["LastDonationDate"],

                        });
                    }
                }
                if (donors.Count > 0)
                {
                    Ok(donors[0]);
                }
                else
                {
                    NotFound("User not found.");

                }
                return Ok(donors);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet("SearchDonorsByBloodGroup/{bloodGroup}")]
        public IActionResult SearchDonorsByBloodGroup(string bloodGroup)
        {
            try
            {
                List<DonorMaster> donors = new List<DonorMaster>();
                SqlParameter[] parameters = new SqlParameter[]
                {
                       new SqlParameter("@BloodGroup", bloodGroup)
                };

                using (SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("SearchDonorsByBloodGroup", parameters))
                {
                    while (reader.Read())
                    {
                        donors.Add(new DonorMaster
                        {
                            DonorId = reader.GetInt32(0),
                            BloodGroup = reader.GetString(3),
                            Age = reader.GetInt32(4),
                            LastDonationDate = reader.IsDBNull(5) ? (DateTime?)null : reader.GetDateTime(5),
                            AvailabilityStatus = reader.GetBoolean(6),
                            Contact=reader.GetString(7),
                            CollegeId = reader.GetInt32(8),
                        });
                    }
                }
                if(donors.Count > 0)
                {
                    return Ok(donors);
                }
                else
                {
                    NotFound("No donors found for the given blood group.");
                }
                return Ok("Done");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpPut("UpdateAvailability/{donorId}")]
        public IActionResult UpdateAvailability(int donorId, [FromBody] bool availabilityStatus)
        {
            try
            {
                string storedProcedureName = "UpdateAvailabilityStatus";

                SqlParameter[] parameters = new SqlParameter[]
                {
                     new SqlParameter("@DonorId", donorId),
                     new SqlParameter("@AvailabilityStatus", availabilityStatus)
                };

               SqlDataReader reader=  AdoDataLayer.GetReaderDataFromQuery(storedProcedureName, parameters);
               
               return Ok("Updated");
              
               
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




    }
}
