using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using StudentBloodBank.ADOLayer;
using System.Collections.Generic;
using System.Data;

[Route("api/[controller]")]
[ApiController]
public class HospitalController : ControllerBase
{
    private readonly AdoDataLayer _adoDataLayer;

    public HospitalController(AdoDataLayer adoDataLayer)
    {
        _adoDataLayer = adoDataLayer;
    }

    // 🔹 Add a New Hospital
    [HttpPost("Add")]
    public IActionResult AddHospital([FromBody] Hospital hospital)
    {
        SqlParameter[] parameters = {
            new SqlParameter("@HospitalName", hospital.HospitalName),
            new SqlParameter("@AddressID", hospital.AddressID),
            new SqlParameter("@Contact", hospital.Contact)
        };

        object result = _adoDataLayer.ExecuteNonQuery("sp_AddHospital", parameters);
        return Ok(new { HospitalId = result });
    }

    // 🔹 Get All Hospitals
    [HttpGet("GetAll")]
    public IActionResult GetAllHospitals()
    {
        List<Hospital> hospitals = new List<Hospital>();
        using (SqlDataReader reader = _adoDataLayer.ExecuteReader("sp_GetAllHospitals"))
        {
            while (reader.Read())
            {
                hospitals.Add(new Hospital
                {
                    HospitalId = reader.GetInt32(0),
                    HospitalName = reader.GetString(1),
                    Contact = reader.GetString(2),
                    Locality = reader.GetString(3),
                    Area = reader.GetString(4)
                });
            }
        }
        return Ok(hospitals);
    }

    // 🔹 Get Hospital By ID
    [HttpGet("GetById/{id}")]
    public IActionResult GetHospitalById(int id)
    {
        SqlParameter[] parameters = {
            new SqlParameter("@HospitalId", id)
        };

        using (SqlDataReader reader = _adoDataLayer.ExecuteReader("sp_GetHospitalById", parameters))
        {
            if (reader.Read())
            {
                var hospital = new Hospital
                {
                    HospitalId = reader.GetInt32(0),
                    HospitalName = reader.GetString(1),
                    Contact = reader.GetString(2),
                    Locality = reader.GetString(3),
                    Area = reader.GetString(4)
                };
                return Ok(hospital);
            }
        }
        return NotFound("Hospital not found");
    }

    // 🔹 Update Hospital
    [HttpPut("Update")]
    public IActionResult UpdateHospital([FromBody] Hospital hospital)
    {
        SqlParameter[] parameters = {
            new SqlParameter("@HospitalId", hospital.HospitalId),
            new SqlParameter("@HospitalName", hospital.HospitalName),
            new SqlParameter("@AddressID", hospital.AddressID),
            new SqlParameter("@Contact", hospital.Contact)
        };

        int rowsAffected = _adoDataLayer.ExecuteNonQuery("sp_UpdateHospital", parameters);
        if (rowsAffected > 0)
            return Ok("Hospital updated successfully");
        return BadRequest("Update failed");
    }

    // 🔹 Delete Hospital
    [HttpDelete("Delete/{id}")]
    public IActionResult DeleteHospital(int id)
    {
        SqlParameter[] parameters = {
            new SqlParameter("@HospitalId", id)
        };

        int rowsAffected = _adoDataLayer.ExecuteNonQuery("sp_DeleteHospital", parameters);
        if (rowsAffected > 0)
            return Ok("Hospital deleted successfully");
        return NotFound("Hospital not found");
    }
}