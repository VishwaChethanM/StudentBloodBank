namespace StudentBloodBank.Model
{
    public class CollegeMaster
    {
        public int CollegeID { get; set; }
        public string CollegeName { get; set; } = string.Empty;
        public int AddressId { get; set; }  
        public string Locality { get; set; } = string.Empty;
        public string Area { get; set; } = string.Empty;

    }
}
