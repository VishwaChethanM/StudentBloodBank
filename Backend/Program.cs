using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StudentBloodBank.ADOLayer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ? Register AdoDataLayer as a service (Singleton)
builder.Services.AddSingleton<AdoDataLayer>();

// ? Load JWT settings
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? "DefaultSecretKey12345");

// ? Add Authentication & Authorization
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });




builder.Services.AddAuthorization();

// ? Configure CORS (Allow All)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ? Add Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Student Blood Bank API", Version = "v1" });
    options.SchemaGeneratorOptions.UseAllOfToExtendReferenceSchemas = false;
});

// ? Build the app
// REPLACE the bottom of Program.cs with this:
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 1. Core routing and static files
app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

// 2. Security and Policy (Order is critical here)
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

// 3. Map the endpoints
app.MapControllers();

app.Run();