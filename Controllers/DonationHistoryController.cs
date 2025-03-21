using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using StudentBloodBank.ADOLayer;
using StudentBloodBank.Model;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationHistoryController : ControllerBase
    {
        [HttpGet("GetAllDonation")]
        public IActionResult GetAllDonationi()
        {
            List<DonationHistroy> dh = new List<DonationHistroy>();
            SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("GetAllDonations");

            while (reader.Read())
            {
                dh.Add(new DonationHistroy
                {
                    DonationID = reader.GetInt32(0),
                    DonorId = reader.GetInt32(1),
                    UserName = reader.GetString(2),
                    BloodGroup = reader.GetString(3),
                    DonationDate = reader.GetDateTime(4),
                    Status = reader.GetString(5),
                    CreatedAt = reader.GetDateTime(6)
                });
            }

            reader.Close();
            return Ok(dh);
        }



        [HttpGet("{id}")]
        public IActionResult GetDonationByID(int id)
        {
            List<DonationHistroy> dhi = new List<DonationHistroy>();

            SqlParameter[] parameters = new SqlParameter[]
                         {
                              new SqlParameter("@DonorId", id)
                         };
            SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("GetDonationsByDonor", parameters);

            while (reader.Read())
            {
                dhi.Add(new DonationHistroy
                {
                    DonationID = reader.GetInt32(0),
                    DonorId = reader.GetInt32(1),
                    UserName = reader.GetString(2),
                    BloodGroup = reader.GetString(3),
                    DonationDate = reader.GetDateTime(4),
                    Status = reader.GetString(5),
                    CreatedAt = reader.GetDateTime(6)

                });
            }

            return Ok(dhi);

        }


        [HttpPost("SaveDonationHistory")]
        public IActionResult AddcollegeDetails(int id, [FromBody] DonationHistroy dhi)
        {
            try
            {
                // Validate Status in C#
                var allowedStatuses = new List<string> { "Pending", "Completed", "Cancelled" };
                if (!allowedStatuses.Contains(dhi.Status))
                {
                    return BadRequest("Invalid status value. Allowed values are: Pending, Completed, Cancelled.");
                }

                // Call stored procedure
                string StoredProcedure = "AddDonation";
                SqlParameter[] parameters = new SqlParameter[]
                {
            new SqlParameter("@DonorId", id),
            new SqlParameter("@BloodGroup", dhi.BloodGroup),
            new SqlParameter("@DonationDate", dhi.DonationDate),
            new SqlParameter("@Status", dhi.Status)
                };

                AdoDataLayer.GetReaderDataFromQuery(StoredProcedure, parameters);
                return Ok("Saved");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }





    }
}
