using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Identity.Client;
using StudentBloodBank.ADOLayer;
using StudentBloodBank.Model;
using System;
using System.Collections.Generic;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressMasterController(AdoDataLayer _adoDataLayer) : ControllerBase
    {
        

        #region Get All Address Details
        [HttpGet("GetAddressDetails")]
        public ActionResult<List<AddressMasterl>> Get()
        {
            try
            {
                List<AddressMasterl> addresses = new List<AddressMasterl>();

                using (SqlDataReader reader = _adoDataLayer.ExecuteReader("GetAllAddress"))
                {
                    while (reader.Read())
                    {
                        addresses.Add(new AddressMasterl
                        {
                            AddressId = reader.GetInt32(0),
                            Locality = reader.GetString(1),
                            Area = reader.GetString(2),
                        });
                    }
                }
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion

        #region Save Address Details
        [HttpPost("PostDetails")]
        public IActionResult PostDetails([FromBody] AddressMasterl address)
        {
            try
            {
                string storedProcedure = "AddAddress";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@Locality", address.Locality),
                    new SqlParameter("@Area", address.Area)
                };
                int rowsAffected = _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);
                if (rowsAffected > 0)
                    return Ok("Address added successfully");
                else
                    return NotFound("Address not added.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        #endregion

        #region Update Address Details
        [HttpPut("PutDetails/{id}")]
        public IActionResult PutDetails(int id, [FromBody] AddressMasterl address)
        {
            try
            {
                string storedProcedure = "UpdateAddress";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@AddressID", id),
                    new SqlParameter("@Locality", address.Locality),
                    new SqlParameter("@Area", address.Area)
                };

                int rowsAffected = _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);

                if (rowsAffected > 0)
                    return Ok("Address updated successfully.");
                else
                    return NotFound("Address not found.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region Delete Address Details
        [HttpDelete("DeleteDetails/{id}")]
        public IActionResult DeleteDetails(int id)
        {
            try
            {
                string storedProcedure = "DeleteAddress";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@AddressID", id)
                };

                int rowsAffected = _adoDataLayer.ExecuteNonQuery(storedProcedure, parameters);

                if (rowsAffected > 0)
                    return Ok("Address deleted successfully.");
                else
                    return NotFound("Address not found.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        #endregion end region
    }

}
