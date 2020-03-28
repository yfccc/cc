using System.Collections.Generic;
using Npgsql;
using System.Data;
using cc.models;
using System;
using System.Linq;

namespace cc.dll
{
    public class GetData
    {
        public T GetList<T>(Purview purview) where T : TableResult, new()
        {
            var connStr = "Host=127.0.0.1;Port=5432;Username=postgres;Password=123456;Database=cc_1";
            NpgsqlConnection conn = new NpgsqlConnection(connStr);
            conn.Open();
            purview.PageIndex = purview.PageIndex - 1;
            NpgsqlDataAdapter adapter = new NpgsqlDataAdapter($"select * from personbase order by id limit {purview.PageSize} offset {purview.PageIndex * purview.PageSize};", conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            NpgsqlCommand cmd = new NpgsqlCommand("select count(*) from personbase;", conn);
            int total = 0;
            object executeResult = cmd.ExecuteScalar();
            if (executeResult != DBNull.Value)
            {
                total = Convert.ToInt32(executeResult);
            }
            conn.Close();
            List<Purview> purviews = new List<Purview>();
            if (dt != null)
            {

                foreach (DataRow row in dt.Rows)
                {
                    purviews.Add(new Purview()
                    {
                        PurviewId = Convert.ToInt32(row["id"]),
                        Memo = row["person_name"] == DBNull.Value ? "" : row["person_name"].ToString(),
                        PurviewName = row["phone_number"].ToString()
                    });
                }
            }
            return new T()
            {
                code = 0,
                count = total,
                data = purviews
            };
        }
    }
}