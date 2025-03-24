namespace StudentBloodBank.Model
{
    public class DonationHistroy
    {
        public int DonationID { get; set; }
        public int DonorId { get; set; }
        public string BloodGroup { get; set; } 
        public DateTime DonationDate { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserName { get; set; }



    }
}
