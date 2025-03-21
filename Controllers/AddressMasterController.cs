using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using StudentBloodBank.ADOLayer;
using StudentBloodBank.Model;
using System.Collections.Generic;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressMasterController : ControllerBase
    {
        [HttpGet("GetAddressDetails")]
        public ActionResult<List<AddressMasterl>> Get()
        {
            List<AddressMasterl> addresses = new List<AddressMasterl>();

            SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("GetAllAddress");
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


        [HttpPost("PostDetails")]
        public IActionResult PostDetails([FromBody] AddressMasterl address)
        {
            try
            {
                string storedProcedureName = "AddAddress";

                SqlParameter[] parameters = new SqlParameter[]
                {
                      new SqlParameter("@Locality", address.Locality),
                      new SqlParameter("@Area", address.Area)
                };

                SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery(storedProcedureName, parameters);
                {
                    if (reader.HasRows)
                    {
                        AddressMasterl insertedAddress = new AddressMasterl();

                        while (reader.Read())
                        {
                            insertedAddress.Locality = reader["Locality"].ToString();
                            insertedAddress.Area = reader["Area"].ToString();
                        }

                        return Ok(insertedAddress);
                    }
                    else
                    {
                        return Ok("Ok done");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




        [HttpPut("PutDetails/{id}")]
        public IActionResult PutDetails(int id, [FromBody] AddressMasterl address)
        {
            try
            {
                string storedProcedureName = "UpdateAddress";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@AddressID", id),
                    new SqlParameter("@Locality", address.Locality),
                    new SqlParameter("@Area", address.Area)
                };

                SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery(storedProcedureName, parameters);
                {
                    if (reader.RecordsAffected > 0)
                    {
                        return Ok("Address updated successfully.");
                    }
                    else
                    {
                        return NotFound("Address not found.");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }





        [HttpDelete("DeleteDetails/{id}")]
        public IActionResult DeleteDetails(int id)
        {
            try
            {
                string storedProcedureName = "DeleteAddress";

                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@AddressID", id)
                };

                SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery(storedProcedureName, parameters);
                {
                    if (reader.RecordsAffected > 0)
                    {
                        return Ok("Address deleted successfully.");
                    }
                    else
                    {
                        return NotFound("Address not found.");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } 
    }
}
