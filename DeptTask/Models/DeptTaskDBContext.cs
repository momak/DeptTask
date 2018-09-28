using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DeptTask.Models
{
    public partial class DeptTaskDBContext : DbContext
    {
        readonly IConfiguration _iConfiguration;
        public DeptTaskDBContext()
        {
        }

        public DeptTaskDBContext(DbContextOptions<DeptTaskDBContext> options, IConfiguration iConfiguration)
            : base(options)
        {
            _iConfiguration = iConfiguration;
        }

        public virtual DbSet<Country> Country { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(_iConfiguration.GetConnectionString("DefaultConnection"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Country>(entity =>
            {
                entity.HasKey(e => e.Code);

                entity.Property(e => e.Code)
                    .HasMaxLength(2)
                    .ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(600);
            });
        }
    }
}
