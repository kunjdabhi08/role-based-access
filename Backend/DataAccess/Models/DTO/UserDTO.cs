using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models.DTO
{
    public class UserDTO
    {
        [MaxLength(30)]
        [Required(ErrorMessage = "Name is Required")]
        public string? Name { get; set; }

        [MaxLength(255)]
        [Required(ErrorMessage = "Email is Required")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is Required")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character and should be minimum 8 character long")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "Confirm password is required")]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string? ConfirmPassword { get; set; }

        public int? RoleId { get; set; }
    }
}
