using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using StudentBloodBank.ADOLayer;
using System.Collections.Generic;
using System.Data;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloodRequestController : ControllerBase
    {
        private readonly AdoDataLayer _adoDataLayer;

        public BloodRequestController(IConfiguration configuration)
        {
            _adoDataLayer = new AdoDataLayer(configuration);
        }

        [HttpPost("Create")]
        public IActionResult CreateRequest(BloodRequest request)
        {
            try
            {
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@UserId", request.UserId),
                    new SqlParameter("@BloodGroup", request.BloodGroup),
                    new SqlParameter("@HospitalId", request.HospitalId),
                    new SqlParameter("@Contact", request.Contact),
                    new SqlParameter("@UrgencyLevel", request.UrgencyLevel)
                };

                int result = _adoDataLayer.ExecuteNonQuery("AddRequest", parameters);
                return result > 0 ? Ok("Blood request created successfully.") : BadRequest("Failed to create request.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }



        [HttpGet("GetAll")]
        public IActionResult GetAllRequests()
        {
            try
            {
                List<BloodRequest> requests = new List<BloodRequest>();

                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("GetAllRequests"))
                {
                    while (reader.Read())
                    {
                        requests.Add(new BloodRequest
                        {
                            UserId = reader.GetInt32(1), // Read UserId as INT
                            BloodGroup = reader.IsDBNull(3) ? "N/A" : reader.GetString(3),
                            HospitalId = reader.GetInt32(4), // Read HospitalId as INT
                            Contact = reader.IsDBNull(6) ? "N/A" : reader.GetString(6),
                            UrgencyLevel = reader.IsDBNull(7) ? "N/A" : reader.GetString(7),
                        });
                    }
                }

                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }



        [HttpPut("Approve/{id}")]
        public IActionResult ApproveRequest(int id)
        {
            SqlParameter param = new SqlParameter("@RequestId", id);
            int result = _adoDataLayer.ExecuteNonQuery("ApproveRequest", new SqlParameter[] { param });
            return result > 0 ? Ok("Request approved successfully.") : BadRequest("Failed to approve request.");
        }

        [HttpPut("Reject/{id}")]
        public IActionResult RejectRequest(int id)
        {
            SqlParameter param = new SqlParameter("@RequestId", id);
            int result = _adoDataLayer.ExecuteNonQuery("RejectRequest", new SqlParameter[] { param });
            return result > 0 ? Ok("Request rejected successfully.") : BadRequest("Failed to reject request.");
        }
    }
}
