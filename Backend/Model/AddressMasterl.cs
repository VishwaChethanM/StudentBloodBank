using System.ComponentModel.DataAnnotations;

namespace StudentBloodBank.Model
{
    public class AddressMasterl
    {
        
        public int AddressId { get; set; }
        [Required]
        [MaxLength(255)]
        public string Locality { get; set; }=string.Empty;
        [Required]
        [MaxLength (234)]
        public string Area { get; set; } = string.Empty;    
    }
}
