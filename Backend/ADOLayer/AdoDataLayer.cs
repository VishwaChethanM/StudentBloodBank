using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;

namespace StudentBloodBank.ADOLayer
{
    public class AdoDataLayer
    {
        private readonly string _connectionString;

        // Constructor to initialize connection string from appsettings.json
        public AdoDataLayer(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                                ?? throw new ArgumentNullException(nameof(configuration), "Connection string is missing.");
        }

        // Fetch Data Using Stored Procedure
        public SqlDataReader ExecuteReader(string storedProcedureName, SqlParameter[] parameters = null)
        {
            try
            {
                var sqlConnection = new SqlConnection(_connectionString);
                var sqlCommand = new SqlCommand(storedProcedureName, sqlConnection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                if (parameters != null)
                {
                    sqlCommand.Parameters.AddRange(parameters);
                }
                sqlConnection.Open();
                return sqlCommand.ExecuteReader(CommandBehavior.CloseConnection);
            }
            catch (Exception ex)
            {
                // Log the error (consider using a logging framework like Serilog)
                Console.WriteLine($"[Error] ExecuteReader: {ex.Message}");
                throw;
            }
        }


        // Execute Insert, Update, Delete Queries
        public int ExecuteNonQuery(string storedProcedure, SqlParameter[] parameters = null)
        {
            try
            {
                using (var sqlConnection = new SqlConnection(_connectionString))
                {
                    sqlConnection.Open();
                    using (var sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;

                        if (parameters != null)
                        {
                            sqlCommand.Parameters.AddRange(parameters);
                        }

                        return sqlCommand.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Error] ExecuteNonQuery: {ex.Message}");
                throw;
            }
        }

    }
}
