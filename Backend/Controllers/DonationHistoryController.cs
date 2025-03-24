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
        #region Get All Donation
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
        #endregion

        #region Get By Id
        [HttpGet("{id}")]
        public IActionResult GetDonationByID(int id)
        {
            List<DonationHistroy> Donation = new List<DonationHistroy>();

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@DonorId", id)
            };
            SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("GetDonationsByDonor", parameters);
            while (reader.Read())
            {
                Donation.Add(new DonationHistroy
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
            return Ok(Donation);

        }
        #endregion

        #region Save Donation History
        [HttpPost("SaveDonationHistory")]
        public IActionResult AddcollegeDetails(int id, [FromBody] DonationHistroy dhi)
        {
            try
            {
                var allowedStatuses = new List<string> { "Pending", "Completed", "Cancelled" };
                if (!allowedStatuses.Contains(dhi.Status))
                {
                    return BadRequest("Invalid status value. Allowed values are: Pending, Completed, Cancelled.");
                }

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
        #endregion


    }
}
