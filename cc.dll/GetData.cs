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
            var connStr = "Host=192.168.197.110;Port=5432;Username=postgres;Password=123456;Database=irisNewAttend_liangbei";
            NpgsqlConnection conn = new NpgsqlConnection(connStr);
            conn.Open();
            purview.PageIndex = purview.PageIndex - 1;
            NpgsqlDataAdapter adapter = new NpgsqlDataAdapter($"select * from purview order by purview_id limit {purview.PageSize} offset {purview.PageIndex * purview.PageSize};", conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            NpgsqlCommand cmd = new NpgsqlCommand("select count(*) from purview;");
            cmd.Connection = conn;
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
                        PurviewId = Convert.ToInt32(row["purview_id"]),
                        Memo = row["memo"] == DBNull.Value ? "" : row["memo"].ToString(),
                        PurviewName = row["purview_name"].ToString()
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