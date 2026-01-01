namespace StudentBloodBank.DTOLayer
{
    public class GetDonationHistroyBySelectedDate
    {
        public DateTime DonationDate { get; set; }

        public string BloodGroup { get; set; }
        public string Status { get; set; }
    }
}
