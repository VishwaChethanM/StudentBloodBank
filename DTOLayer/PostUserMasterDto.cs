using System.ComponentModel.DataAnnotations;

namespace StudentBloodBank.DTOLayer
{
    public class PostUserMasterDto
    {


        [Required]
        [MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [MaxLength(5)]
        public string BloodGroup { get; set; } = string.Empty;

        [Required]
        [MaxLength(13)]
        [MinLength(13)]
        public string Contact { get; set; } = string.Empty;

        public string Role { get; set; }

        public int? Collegeid { get; set; }
        public int AddressId { get; set; }

    }
}
