using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using StudentBloodBank.ADOLayer;
using StudentBloodBank.Model;
using System;
using System.Collections.Generic;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollegeMasterController : ControllerBase
    {
        private readonly AdoDataLayer _adoDataLayer;

        public CollegeMasterController(AdoDataLayer adoDataLayer)
        {
            _adoDataLayer = adoDataLayer;
        }

        #region Get All College Details
        [HttpGet("GetCollegeDetails")]
        public IActionResult GetCollegeDetails()
        {
            try
            {
                List<CollegeMaster> colleges = new List<CollegeMaster>();

                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("GetAllColleges"))
                {
                    while (reader.Read())
                    {
                        colleges.Add(new CollegeMaster
                        {
                            CollegeID = reader.GetInt32(0),
                            CollegeName = reader.GetString(1),
                            AddressId = reader.GetInt32(2),
                            Locality = reader.GetString(3),
                            Area = reader.GetString(4)
                        });
                    }
                }

                return Ok(colleges);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion

        #region Save College Details
        [HttpPost("SaveCollege")]
        public IActionResult AddCollegeDetails([FromBody] CollegeMaster clg)
        {
            try
            {
                string storedProcedure = "AddCollege";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@CollegeName", clg.CollegeName),
                    new SqlParameter("@AddressID", clg.AddressId)
                };

                int rowsAffected = _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);

                if (rowsAffected > 0)
                    return Ok("College saved successfully.");
                else
                    return BadRequest("Failed to save college.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion

        #region Update College Details
        [HttpPut("UpdateDetails/{id}")]
        public IActionResult UpdateDetails(int id, [FromBody] CollegeMaster clg)
        {
            try
            {
                string storedProcedure = "UpdateCollege";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@CollegeID", id),
                    new SqlParameter("@CollegeName", clg.CollegeName),
                    new SqlParameter("@AddressID", clg.AddressId)
                };

                int rowsAffected = _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);

                if (rowsAffected > 0)
                    return Ok("College updated successfully.");
                else
                    return NotFound("College not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion

        #region Delete College Details
        [HttpDelete("DeleteCollege/{id}")]
        public IActionResult DeleteCollege(int id)
        {
            try
            {
                string storedProcedure = "DeleteCollege";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@CollegeID", id)
                };

                int rowsAffected = _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);

                if (rowsAffected > 0)
                    return Ok("College deleted successfully.");
                else
                    return NotFound("College not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion
    }
}
