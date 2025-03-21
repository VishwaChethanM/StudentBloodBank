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


        [HttpGet("GetDonationsByDonor ${id}")]
        public IActionResult GetDonationByID(int ID)
        {
            List<DonationHistroy> dhi = new List<DonationHistroy>();
            SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("GetDonationsByDonor");
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

        public IActionResult AddcollegeDetails(int id,[FromBody] DonationHistroy dhi)
        {
            try
            {
                String StoredProcedure = "AddDonation";
                SqlParameter[] parameter = new SqlParameter[]
                {
                     new SqlParameter("@@DonorId", id),
                     new SqlParameter("@BloodGroup", dhi.BloodGroup),
                     new SqlParameter("@DonationDate", dhi.DonationDate),
                     new SqlParameter("@Status", dhi.Status)

                };
                AdoDataLayer.GetReaderDataFromQuery(StoredProcedure, parameter);
                return Ok("Saved");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }




    }
}
