using System.ComponentModel.DataAnnotations;

public class BloodRequest
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public string BloodGroup { get; set; }

    [Required]
    public int HospitalId { get; set; }

    [Required]
    [Phone]
    public string Contact { get; set; }

    [Required]
    public string UrgencyLevel { get; set; }
}
