using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using StudentBloodBank.ADOLayer;
using StudentBloodBank.DTOLayer;
using StudentBloodBank.Model;
using System;
using System.Collections.Generic;
using System.Data;
using static StudentBloodBank.DTOLayer.UserProfileUpdateModel;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationHistoryController : ControllerBase
    {
        private readonly AdoDataLayer _adoDataLayer;

        public DonationHistoryController(AdoDataLayer adoDataLayer)
        {
            _adoDataLayer = adoDataLayer;
        }

        #region Get All Donations
        [HttpGet("GetAllDonations")]
        public IActionResult GetAllDonations()
        {
            try
            {
                List<DonationHistroy> donations = new List<DonationHistroy>();

                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("GetAllDonations"))
                {
                    while (reader.Read())
                    {
                        donations.Add(new DonationHistroy
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
                }

                return Ok(donations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion


        #region Get Donation By Donor ID
        [HttpGet("GetUserDonations/{userId}")]
        public IActionResult GetUserDonations(int userId)
        {
            try
            {
                SqlParameter[] parameters = { new SqlParameter("@UserId", userId) };
                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("GetDonationHistoryByUserId", parameters))
                {
                    List<DonationHistroy> donations = new List<DonationHistroy>();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            donations.Add(new DonationHistroy
                            {
                                DonationID = reader.GetInt32(0),
                                DonorId = reader.GetInt32(1),
                                UserName = reader.GetString(2),
                                BloodGroup = reader.GetString(3),
                                DonationDate = reader.GetDateTime(4),
                                Status = reader.GetString(5)
                            });
                        }
                        return Ok(donations);
                    }
                    else
                    {
                        return NotFound(new { Message = "No donation history found." });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred", Error = ex.Message });
            }
        }
        #endregion



        #region Save Donation History
        [HttpPost("SaveDonation")]
        public IActionResult SaveDonation([FromBody] DonationHistroy donation)
        {
            if (donation.DonorId <= 0 || string.IsNullOrEmpty(donation.BloodGroup) || donation.DonationDate == default)
                return BadRequest(new { Message = "Invalid donor details or donation date." });

            var allowedStatuses = new List<string> { "Pending", "Completed", "Rejected" };
            if (!allowedStatuses.Contains(donation.Status))
                return BadRequest(new { Message = "Invalid status value. Allowed values: Pending, Completed, Rejected." });

            try
            {
                SqlParameter[] parameters = {
                    new SqlParameter("@DonorId", donation.DonorId),
                    new SqlParameter("@BloodGroup", donation.BloodGroup),
                    new SqlParameter("@DonationDate", donation.DonationDate),
                    new SqlParameter("@Status", donation.Status)
                };

                int rowsAffected = _adoDataLayer.ExecuteNonQuery("AddDonation", parameters);
                return rowsAffected > 0 ? Ok(new { Message = "Donation history saved successfully." })
                                        : BadRequest(new { Message = "Failed to save donation history." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal Server Error", Error = ex.Message });
            }
        }

        #endregion


        //new APIS for Donation master
        [HttpPut("UpdateDonation/{id}")]
        public IActionResult UpdateDonation(int id, [FromBody] DonationHistoryUpdateDto donation)
        {
            if (donation == null)
                return BadRequest("Invalid donation data.");

            try
            {
                string storedProcedure = "sp_UpdateDonationHistory";
                SqlParameter[] parameters = new SqlParameter[]
                {
                       new SqlParameter("@DonationID", id),
                       new SqlParameter("@DonorId", donation.DonorId),
                       new SqlParameter("@BloodGroup", donation.BloodGroup),
                       new SqlParameter("@DonationDate", donation.DonationDate),
                       new SqlParameter("@Status", donation.Status)
                };

                int rowsAffected = _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);

                if (rowsAffected > 0)
                {
                    return Ok(new
                    {
                        DonationID = id,
                        DonorId = donation.DonorId,
                        BloodGroup = donation.BloodGroup,
                        DonationDate = donation.DonationDate,
                        Status = donation.Status
                    });
                }
                else
                {
                    return NotFound("Donation record not found.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteDonationHistory/{id}")]
        public IActionResult DeleteDonationHistory(int id)
        {
            try
            {
                string storedProcedure = "DeleteDonationHistory";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@DonationID", id)
                };
                int rowsAffected = _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);
                if (rowsAffected > 0)
                {
                    return Ok("Donation history deleted successfully.");
                }
                else
                {
                    return NotFound("Donation history record not found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet("GetDonationsBYSelectedDate")]
        public IActionResult GetDonations([FromQuery] string? date, [FromQuery] string? bloodGroup, [FromQuery] string? status)
        {
            try
            {
                List<GetDonationHistroyBySelectedDate> donations = new List<GetDonationHistroyBySelectedDate>();

                // Create SQL parameters for stored procedure
                SqlParameter[] parameters = new SqlParameter[]
                {
            new SqlParameter("@Date", string.IsNullOrEmpty(date) ? DBNull.Value : date),
            new SqlParameter("@BloodGroup", string.IsNullOrEmpty(bloodGroup) ? DBNull.Value : bloodGroup),
            new SqlParameter("@Status", string.IsNullOrEmpty(status) ? DBNull.Value : status)
                };

                // Execute stored procedure and get reader
                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("SP_GetDonationHistory", parameters))
                {
                    while (reader.Read())
                    {
                        donations.Add(new GetDonationHistroyBySelectedDate
                        {
                            BloodGroup = reader.GetString(2),
                            DonationDate = reader.GetDateTime(3),
                            Status = reader.GetString(4)
                        });
                    }
                }

                return Ok(donations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }




        [HttpGet("GetUserDonationHistory")]
        public IActionResult GetUserDonationHistory([FromQuery] string? Email, [FromQuery] string? Password)
        {
            try
            {
                List<DonationHistoryLoginDTO> history = new List<DonationHistoryLoginDTO>();
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("email", Email),
                    new SqlParameter("password", Password)
                };
                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("GetUserDonationHistory", parameters))
                {
                    while (reader.Read())
                    {
                        history.Add(new DonationHistoryLoginDTO
                        {
                            Status = reader.GetString(4),
                            BloodGroup = reader.GetString(2),
                            DonationDate = reader.GetDateTime(3),
                        });



                    }
                }
                return Ok(history);

            }
            catch (Exception ex)
            {
                BadRequest(ex.Message);
            }
            return Ok();
        }





    }
}
