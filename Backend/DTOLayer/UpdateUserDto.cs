using System.ComponentModel.DataAnnotations;

namespace StudentBloodBank.DTOLayer
{
    public class UpdateUserDto
    {
        public int UserId { get; set; }

        [MaxLength(50)]
        public string? UserName { get; set; } // Make nullable if not always updated

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(5)]
        public string? BloodGroup { get; set; }

        [MaxLength(13)]
        [MinLength(13)]
        public string? Contact { get; set; }

        public string? Role { get; set; }
        public int? Collegeid { get; set; }
        public int? AddressId { get; set; }
        // Add other fields that you want to allow updating.
        // Do NOT include Password unless it's explicitly being updated, and handle it separately.
        public string? Status { get; set; } // Add this if you want to update status via this DTO
    }
}