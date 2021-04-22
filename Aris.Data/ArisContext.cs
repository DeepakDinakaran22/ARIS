using Aris.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Aris.Data
{
    public class ArisContext : DbContext
    {
        public ArisContext()
        {
        }
        public ArisContext(DbContextOptions<ArisContext> options) : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(ConnectionService.connstring);
        }

        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<Company> Company { get; set; }
        public virtual DbSet<DocumentCategory> DocumentCategory{ get; set; }
        public virtual DbSet<DocumentType> DocumentType { get; set; }
        public virtual DbSet<EmployeeDetails> EmployeeDetails { get; set; }
        public virtual DbSet<UserType> UserType { get; set; }
        public virtual DbSet<EmployeeFileUploads> EmployeeFileUploads { get; set; }
        public virtual DbSet<ErrorLog> ErrorLog { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserId)
                .HasColumnName("UserId");

                entity.Property(e => e.FullName)
                .HasColumnName("FullName");

                entity.Property(e => e.UserName)
                .HasColumnName("UserName");
                
                entity.Property(e => e.MailAddress)
               .HasColumnName("MailAddress");


                entity.Property(e => e.IsActive)
                .HasColumnName("IsActive");

                entity.Property(e => e.UserImage)
               .HasColumnName("UserImage");

                entity.Property(e => e.UserTypeID)
               .HasColumnName("UserTypeID");

                entity.Property(e => e.CreatedBy)
               .HasColumnName("CreatedBy");

                entity.Property(e => e.CreatedDate)
               .HasColumnName("CreatedDate");

                entity.Property(e => e.ModifiedBy)
               .HasColumnName("ModifiedBy");

                entity.Property(e => e.ModifiedDate)
               .HasColumnName("ModifiedDate");
            });
            modelBuilder.Entity<Company>(entity => {
                entity.HasKey(e => e.CompanyId);

                entity.Property(e => e.CompanyId)
                .HasColumnName("CompanyId");

                entity.Property(e => e.CompanyName)
                .HasColumnName("companyName");

                entity.Property(e => e.CompanyDescription)
                .HasColumnName("CompanyDescription");

                entity.Property(e => e.IsActive)
                .HasColumnName("IsActive");

                entity.Property(e => e.CreatedBy)
               .HasColumnName("CreatedBy");

                entity.Property(e => e.CreatedDate)
               .HasColumnName("CreatedDate");

                entity.Property(e => e.ModifiedBy)
               .HasColumnName("ModifiedBy");

                entity.Property(e => e.ModifiedDate)
               .HasColumnName("ModifiedDate");

            });
            modelBuilder.Entity<DocumentCategory>(entity =>
            {
                entity.HasKey(e => e.DocumentCategoryID);

                entity.Property(e => e.DocumentCategoryID)
                .HasColumnName("DocumentCategoryID");

                entity.Property(e => e.DocumentCategoryName)
                .HasColumnName("DocumentCategoryName");

                entity.Property(e => e.IsActive)
                .HasColumnName("IsActive");

                entity.Property(e => e.CreatedBy)
               .HasColumnName("CreatedBy");

                entity.Property(e => e.CreatedDate)
               .HasColumnName("CreatedDate");

                entity.Property(e => e.ModifiedBy)
               .HasColumnName("ModifiedBy");

                entity.Property(e => e.ModifiedDate)
               .HasColumnName("ModifiedDate");

            });
            modelBuilder.Entity<DocumentType>(entity => 
            {
                entity.HasKey(e => e.DocumentId);

                entity.Property(e => e.DocumentId)
                .HasColumnName("DocumentId");

                entity.Property(e => e.DocumentName)
                .HasColumnName("DocumentName");

                entity.Property(e => e.DocumentDescription)
                .HasColumnName("DocumentDescription");
               
                entity.Property(e => e.DocumentCategoryID)
                .HasColumnName("DocumentCategoryID");

                entity.Property(e => e.IsActive)
                .HasColumnName("IsActive");

                entity.Property(e => e.CreatedBy)
               .HasColumnName("CreatedBy");

                entity.Property(e => e.CreatedDate)
               .HasColumnName("CreatedDate");

                entity.Property(e => e.ModifiedBy)
               .HasColumnName("ModifiedBy");

                entity.Property(e => e.ModifiedDate)
               .HasColumnName("ModifiedDate");

            });
            modelBuilder.Entity<EmployeeDetails>(entity =>
            {
                entity.HasKey(e => e.EmployeeNo);

                entity.Property(e => e.EmployeeNo)
                .HasColumnName("EmployeeNo");

                entity.Property(e => e.EmployeeName)
                .HasColumnName("EmployeeName");

                entity.Property(e => e.CompanyId)
                .HasColumnName("CompanyId");


                entity.Property(e => e.Nationality)
                .HasColumnName("Nationality");

                entity.Property(e => e.PassportNumber)
                .HasColumnName("PassportNumber");

                entity.Property(e => e.PassportExpiryDate)
                .HasColumnName("PassportExpiryDate");
                
                entity.Property(e => e.ResidentNumber)

               .HasColumnName("ResidentNumber");

                entity.Property(e => e.ResidentExpiryDate)
                .HasColumnName("ResidentExpiryDate");

                entity.Property(e => e.JoiningDate)
                .HasColumnName("JoiningDate");



                entity.Property(e => e.ContractStartDate)
                .HasColumnName("ContractStartDate");

                entity.Property(e => e.ContractEndDate)
                .HasColumnName("ContractEndDate");

                entity.Property(e => e.Gsm)
                .HasColumnName("Gsm");

                entity.Property(e => e.AccomodationDetails)

               .HasColumnName("AccomodationDetails");

                entity.Property(e => e.MaritalStatus)
                .HasColumnName("MaritalStatus");

                entity.Property(e => e.IDProfession)
                .HasColumnName("IDProfession");


                entity.Property(e => e.Designation)
               .HasColumnName("Designation");

                entity.Property(e => e.BankName)

               .HasColumnName("BankName");

                entity.Property(e => e.BankAccountNumber)
                .HasColumnName("BankAccountNumber");

                entity.Property(e => e.EmployeeImage)
                .HasColumnName("EmployeeImage");


                entity.Property(e => e.IsActive)
                .HasColumnName("IsActive");

                

                entity.Property(e => e.CreatedBy)
               .HasColumnName("CreatedBy");

                entity.Property(e => e.CreatedDate)
               .HasColumnName("CreatedDate");

                entity.Property(e => e.ModifiedBy)
               .HasColumnName("ModifiedBy");

                entity.Property(e => e.ModifiedDate)
               .HasColumnName("ModifiedDate");
                entity.Property(e => e.ApprovalStatus)
               .HasColumnName("ApprovalStatus");
            });
            modelBuilder.Entity<UserType>(entity => {
                entity.HasKey(e => e.UserTypeID);

                entity.Property(e => e.UserTypeID)
                .HasColumnName("UserTypeID");

                entity.Property(e => e.UserTypes)
                .HasColumnName("UserTypes");

                entity.Property(e => e.IsActive)
                .HasColumnName("IsActive");

                entity.Property(e => e.CreatedBy)
               .HasColumnName("CreatedBy");

                entity.Property(e => e.CreatedDate)
               .HasColumnName("CreatedDate");

                entity.Property(e => e.ModifiedBy)
               .HasColumnName("ModifiedBy");

                entity.Property(e => e.ModifiedDate)
               .HasColumnName("ModifiedDate");

            });
            modelBuilder.Entity<EmployeeFileUploads>(entity => {
                entity.HasKey(e => e.EmpFileUploadId);

                entity.Property(e => e.EmpFileUploadId)
                .HasColumnName("EmpFileUploadId");

                entity.Property(e => e.EmployeeNo)
                .HasColumnName("EmployeeNo");

                entity.Property(e => e.EmployeeOrderNo)
                .HasColumnName("EmployeeOrderNo");

                entity.Property(e => e.UploadType)
              .HasColumnName("UploadType");

                entity.Property(e => e.FileName)
                .HasColumnName("FileName");


                entity.Property(e => e.FileLocation)
                .HasColumnName("FileLocation");

                entity.Property(e => e.TempEmployeeNo)
                .HasColumnName("TempEmployeeNo");

                entity.Property(e => e.IsActive)
                .HasColumnName("IsActive");

                entity.Property(e => e.CreatedBy)
               .HasColumnName("CreatedBy");

                entity.Property(e => e.CreatedDate)
               .HasColumnName("CreatedDate");

                entity.Property(e => e.ModifiedBy)
               .HasColumnName("ModifiedBy");

                entity.Property(e => e.ModifiedDate)
               .HasColumnName("ModifiedDate");

            });
            modelBuilder.Entity<ErrorLog>(entity =>
            {
                entity.HasKey(e => e.ErrorId);

                entity.Property(e => e.ErrorId)
                .HasColumnName("ErrorId");

                entity.Property(e => e.Message)
                .HasColumnName("Message");

                entity.Property(e => e.Method)
                .HasColumnName("Method");

                entity.Property(e => e.InnerException)
                .HasColumnName("InnerException");

                entity.Property(e => e.ErrorDate)
                .HasColumnName("ErrorDate");

            });


            }
    }
}