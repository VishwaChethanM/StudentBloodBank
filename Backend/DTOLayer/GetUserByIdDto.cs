namespace StudentBloodBank.DTOLayer
{
    public class GetUserByIdDto
    {


        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string BloodGroup { get; set; }
        public string Contact { get; set; }
        public int Role { get; set; }
        public int AddressId { get; set; }
        public int? CollegeID { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
