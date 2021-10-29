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
        public virtual DbSet<OfficeDocDetails> OfficeDocDetails { get; set; }
        public virtual DbSet<OfficeDocsFileUploads> OfficeDocsFileUploads { get; set; }
        public virtual DbSet<OfficeDocsFileUploads> CompanyFileUploads { get; set; }
        public virtual DbSet<Salary> Salary { get; set; }

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

                entity.Property(e => e.CompanyServices)
                .HasColumnName("CompanyServices");

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

                entity.Property(e => e.CompanyLocation)
               .HasColumnName("CompanyLocation");

                entity.Property(e => e.CompanyExpiry)
               .HasColumnName("CompanyExpiry");

                entity.Property(e => e.CompanyEmail)
                .HasColumnName("CompanyEmail");
                entity.Property(e => e.CompanyPhone)
                .HasColumnName("CompanyPhone");


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
                entity.Property(e => e.IsExpiryRequired)
              .HasColumnName("IsExpiryRequired");
                entity.Property(e => e.IsMandatory)
            .HasColumnName("IsMandatory");

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
                entity.Property(e => e.EmployeeReferenceNo)
                .HasColumnName("EmployeeReferenceNo");
                entity.Property(e => e.Remarks)
                .HasColumnName("Remarks");

            });
            modelBuilder.Entity<UserType>(entity => {
                entity.HasKey(e => e.UserTypeID);

                entity.Property(e => e.UserTypeID)
                .HasColumnName("UserTypeID");

                entity.Property(e => e.UserRole)
                .HasColumnName("UserType");

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

                entity.Property(e => e.EmployeeReferenceNo)
                .HasColumnName("EmployeeReferenceNo");

                entity.Property(e => e.DocumentId)
              .HasColumnName("DocumentId");

                entity.Property(e => e.FileName)
                .HasColumnName("FileName");


                entity.Property(e => e.FileLocation)
                .HasColumnName("FileLocation");

                entity.Property(e => e.IsValid)
                .HasColumnName("IsValid");

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

                entity.Property(e => e.ActualFileName)
                .HasColumnName("ActualFileName");
                entity.Property(e => e.ExpiryDate)
                .HasColumnName("ExpiryDate");
            });
            modelBuilder.Entity<OfficeDocsFileUploads>(entity => {
                entity.HasKey(e => e.DocFileUploadId);

                entity.Property(e => e.DocFileUploadId)
                .HasColumnName("DocFileUploadId");

                entity.Property(e => e.DocumentId)
                .HasColumnName("DocumentId");

                entity.Property(e => e.FileName)
                .HasColumnName("FileName");

                entity.Property(e => e.ActualFileName)
              .HasColumnName("ActualFileName");

                entity.Property(e => e.FileLocation)
                .HasColumnName("FileLocation");

                entity.Property(e => e.IsValid)
                .HasColumnName("IsValid");

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
            modelBuilder.Entity<CompanyFileUploads>(entity => {
                entity.HasKey(e => e.CompanyFileUploadId);

                entity.Property(e => e.CompanyFileUploadId)
                .HasColumnName("CompanyFileUploadId");

                entity.Property(e => e.DocumentId)
                .HasColumnName("DocumentId");

                entity.Property(e => e.FileName)
                .HasColumnName("FileName");

                entity.Property(e => e.ActualFileName)
              .HasColumnName("ActualFileName");

                entity.Property(e => e.FileLocation)
                .HasColumnName("FileLocation");
                entity.Property(e => e.CompanyId)
                .HasColumnName("CompanyId");

                entity.Property(e => e.IsValid)
                .HasColumnName("IsValid");

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
                entity.Property(e => e.CompanyExpiry)
               .HasColumnName("CompanyExpiry");

            });
            modelBuilder.Entity<OfficeDocDetails>(entity => {
                entity.HasKey(e => e.OfficeDocId);

                entity.Property(e => e.OfficeDocId)
                .HasColumnName("OfficeDocId");

                entity.Property(e => e.DocumentId)
                .HasColumnName("DocumentId");

                entity.Property(e => e.DocIssueDate)
                .HasColumnName("DocIssueDate");

                entity.Property(e => e.DocExpiryDate)
              .HasColumnName("DocExpiryDate");

                entity.Property(e => e.OfficeDocDesc)
                .HasColumnName("OfficeDocDesc");

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
            modelBuilder.Entity<Salary>(entity => {
                entity.HasKey(e => e.SalaryId);

                entity.Property(e => e.SalaryId)
                .HasColumnName("SalaryId");

                entity.Property(e => e.EmployeeNo)
                .HasColumnName("EmployeeNo");

                entity.Property(e => e.OvertimeOrExtraDuties)
                .HasColumnName("OvertimeOrExtraDuties");

                entity.Property(e => e.TranspotationAllowance)
              .HasColumnName("TranspotationAllowance");

                entity.Property(e => e.OtherAllowance)
                .HasColumnName("OtherAllowance");

                entity.Property(e => e.TelephoneAllowance)
                .HasColumnName("TelephoneAllowance");

                entity.Property(e => e.FoodAllowance)
               .HasColumnName("FoodAllowance");
                
                entity.Property(e => e.TaxiCharges)
               .HasColumnName("TaxiCharges");

                entity.Property(e => e.RoomRent)
               .HasColumnName("RoomRent");

                entity.Property(e => e.GrossSalary)
               .HasColumnName("GrossSalary");

                entity.Property(e => e.SocialInsurance)
               .HasColumnName("SocialInsurance");

                entity.Property(e => e.LeaveDeduction)
               .HasColumnName("LeaveDeduction");


                entity.Property(e => e.AdvanceDeduction)
                .HasColumnName("AdvanceDeduction");

                entity.Property(e => e.OtherDeduction)
                .HasColumnName("OtherDeduction");

                entity.Property(e => e.TotalDeduction)
              .HasColumnName("TotalDeduction");

                entity.Property(e => e.NetSalary)
                .HasColumnName("NetSalary");

                entity.Property(e => e.Remarks)
                .HasColumnName("Remarks");

                entity.Property(e => e.Basic)
               .HasColumnName("Basic");

                entity.Property(e => e.TotalSalaryPAyment)
               .HasColumnName("TotalSalaryPAyment");

                entity.Property(e => e.ModeOfPayment)
               .HasColumnName("ModeOfPayment");

                entity.Property(e => e.SalaryApprovalStatusId)
               .HasColumnName("SalaryApprovalStatusId");

                entity.Property(e => e.NextActionId)
               .HasColumnName("NextActionId");

                entity.Property(e => e.ApprovedBy)
               .HasColumnName("ApprovedBy");

                entity.Property(e => e.CheckedBy)
               .HasColumnName("CheckedBy");


                entity.Property(e => e.PreparedBy)
                .HasColumnName("PreparedBy");

                entity.Property(e => e.CreatedDate)
                .HasColumnName("CreatedDate");

                entity.Property(e => e.CreatedBy)
               .HasColumnName("CreatedBy");

                entity.Property(e => e.ModifiedBy)
               .HasColumnName("ModifiedBy");

                entity.Property(e => e.ModifiedDate)
               .HasColumnName("ModifiedDate");

            });


        }
    }
}