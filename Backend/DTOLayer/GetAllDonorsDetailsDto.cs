namespace StudentBloodBank.DTOLayer
{
    public class GetAllDonorsDetailsDto
    {
        public int DonorId { get; set; }
        public int UserId { get; set; }
        public int Age { get; set; }
        public DateTime LastDonationDate { get; set; }
        public bool AvailabilityStatus { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
