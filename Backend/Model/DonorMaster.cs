namespace StudentBloodBank.Model
{
    public class DonorMaster
    {
        public int UserId { get; set; }
        public int DonorId { get; set; }
        public int Age { get; set; }
        public string BloodGroup { get; set; }  
        public string Contact { get; set; }
        public int CollegeId { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime? LastDonationDate { get; set; }
        public bool AvailabilityStatus { get; set; }
    }
}
