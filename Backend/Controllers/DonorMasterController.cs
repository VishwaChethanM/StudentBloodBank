using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using StudentBloodBank.ADOLayer;
using StudentBloodBank.DTOLayer;
using StudentBloodBank.Model;
using System;
using System.Collections.Generic;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonorMasterController : ControllerBase
    {
        private readonly AdoDataLayer _adoDataLayer;

        public DonorMasterController(AdoDataLayer adoDataLayer)
        {
            _adoDataLayer = adoDataLayer;
        }

        #region Save Donor Details
        [HttpPost("SaveDonor")]
        public IActionResult SaveDonor([FromBody] DonorMaster donor)
        {
            try
            {
                string storedProcedure = "RegisterDonor";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@userId", donor.UserId),
                    new SqlParameter("@Age", donor.Age),
                    new SqlParameter("@LastDonationDate", donor.LastDonationDate ?? (object)DBNull.Value),
                    new SqlParameter("@AvailabilityStatus", donor.AvailabilityStatus)
                };

                _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);
                return Ok("Donor saved successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion

        #region Get All Donors
        [HttpGet("GetAllDonors")]
        public IActionResult GetAllDonors()
        {
            try
            {
                List<GetAllDonorsDetailsDto> donors = new List<GetAllDonorsDetailsDto>();

                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("GetAllDonors"))
                {
                    while (reader.Read())
                    {
                        donors.Add(new GetAllDonorsDetailsDto
                        {
                            DonorId = reader.GetInt32(0),
                            UserId = reader.GetInt32(1),
                            Age = reader.GetInt32(2),
                            LastDonationDate = reader.GetDateTime(3),
                            AvailabilityStatus = reader.GetBoolean(4),
                            CreatedDate = reader.GetDateTime(5),
                        });
                    }
                }

                return Ok(donors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion

        #region Get Donor By ID
        [HttpGet("GetDonorById/{id}")]
        public IActionResult GetDonorById(int id)
        {
            try
            {
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@DonorId", id)
                };
                List<DonorMaster> donor = new List<DonorMaster>();

                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("GetDonorById", parameters))
                {
                    while (reader.Read())
                    {
                        donor.Add(new DonorMaster
                        {
                            DonorId = reader.GetInt32(0),
                            Email = reader.GetString(1),
                            BloodGroup = reader.GetString(2),
                            Age = reader.GetInt32(3),
                            LastDonationDate = reader.IsDBNull(4) ? (DateTime?)null : reader.GetDateTime(4),
                            AvailabilityStatus = reader.GetBoolean(5),
                            Contact = reader.GetString(6),
                            CollegeId = reader.GetInt32(7),
                        });
                    }
                }

                if (donor.Count == 0)
                    return NotFound("Donor not found.");

                return Ok(donor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion

        #region Search Donors By Blood Group
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

                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("SearchDonorsByBloodGroup", parameters))
                {
                    while (reader.Read())
                    {
                        donors.Add(new DonorMaster
                        {
                            DonorId = reader.GetInt32(0),
                            BloodGroup = reader.GetString(1),
                            Age = reader.GetInt32(2),
                            LastDonationDate = reader.IsDBNull(3) ? (DateTime?)null : reader.GetDateTime(3),
                            AvailabilityStatus = reader.GetBoolean(4),
                            Contact = reader.GetString(5),
                            CollegeId = reader.GetInt32(6),
                        });
                    }
                }
                if (donors.Count == 0)
                    return NotFound("No donors found for the given blood group.");
                return Ok(donors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion


        #region Update Donor Availability
        [HttpPut("UpdateAvailability/{donorId}")]
        public IActionResult UpdateAvailability(int donorId, [FromBody] bool availabilityStatus)
        {
            try
            {
                string storedProcedure = "UpdateAvailabilityStatus";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@DonorId", donorId),
                    new SqlParameter("@AvailabilityStatus", availabilityStatus)
                };

                int rowsAffected = _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);

                if (rowsAffected == 0)
                    return NotFound("No donor found with the given ID.");

                return Ok("Donor availability updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion
    }
}
