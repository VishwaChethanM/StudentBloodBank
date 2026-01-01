namespace StudentBloodBank.DTOLayer
{
    public class UserProfileUpdateModel
    {
        public class UserUpdateModel
        {
            public int UserId { get; set; }
            public string UserName { get; set; }
            public string Email { get; set; }
            public string BloodGroup { get; set; }
            public string Phone { get; set; }
            public int Address { get; set; } 
        }

    }
}
