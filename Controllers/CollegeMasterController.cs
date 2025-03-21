using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using StudentBloodBank.ADOLayer;
using StudentBloodBank.Model;
using System.Reflection.Metadata;
using System.Security.Cryptography;

namespace StudentBloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollegeMasterController : ControllerBase
    {
        [HttpGet("GetCollegeDetails")]
        public IActionResult getCollegeDetails()
        {

            List<CollegeMaster> college = new List<CollegeMaster>();
            SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery("GetAllColleges");
            {
                while (reader.Read())
                {

                    college.Add(new CollegeMaster
                    {
                        CollegeID = reader.GetInt32(0),
                        CollegeName = reader.GetString(1),
                        AddressId=reader.GetInt32(2),
                        Locality =reader.GetString(3),
                        Area=reader.GetString(4),

                    });
                }

            }
            return Ok(college);

        }




        [HttpPost("SaveCollege")]
        public IActionResult AddcollegeDetails([FromBody] CollegeMaster clg)
        {
            try
            {
                String StoredProcedure = "AddCollege";
                SqlParameter[] parameter = new SqlParameter[]
                {
                    new SqlParameter("@CollegeName", clg.CollegeName),
                    new SqlParameter("@AddressID", clg.AddressId)

                };
                AdoDataLayer.GetReaderDataFromQuery(StoredProcedure, parameter);
                return Ok("Saved");
            }
            catch (Exception ex) { 
               return BadRequest(ex.Message);
            }

        }




        [HttpPut("UpdateDetails")]
        public IActionResult UpdateDetails(int id,CollegeMaster clg)
        {
            try
            {
                string storedProcedure = "UpdateCollege";
                SqlParameter[] parameter = new SqlParameter[]
                {
                    new SqlParameter("@CollegeID",id),
                    new SqlParameter("@CollegeName",clg.CollegeName),
                    new SqlParameter("@AddressID",clg.AddressId)

                };
                SqlDataReader reader = AdoDataLayer.GetReaderDataFromQuery(storedProcedure, parameter);
                if (reader.RecordsAffected > 0)
                {
                    return Ok("Done with Update");
                }
                else
                {
                    return BadRequest("some thing went wrong");
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




        [HttpDelete("DeleteClgDetails/{id}")]
        public IActionResult Delete(int id)
        {
            string storedProcedure = "DeleteCollege";
            try
            {
                SqlParameter[] parameters = new SqlParameter[]
                {
                         new SqlParameter("@CollegeID", id)
                };

                AdoDataLayer.GetReaderDataFromQuery(storedProcedure, parameters);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok("Deleted");
        }



    }
}
