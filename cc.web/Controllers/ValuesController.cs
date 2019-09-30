using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Data;

namespace cc.web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        // GET api/values
        [HttpGet]
        public ActionResult<TableResult> Get()
        {
            var connStr = "Host=10.2.1.97;Port=5432;Username=postgres;Password=123456;Database=irisNewAttend-100";
            NpgsqlConnection conn = new NpgsqlConnection(connStr);
            conn.Open();
            NpgsqlDataAdapter adapter = new NpgsqlDataAdapter("select * from purview;", conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            conn.Close();
            List<Purview> purviews = new List<Purview>();
            if (dt != null)
            {

                foreach (DataRow row in dt.Rows)
                {
                    purviews.Add(new Purview()
                    {
                        PurviewId = Convert.ToInt32(row["purview_id"]),
                        PurviewName = row["purview_name"].ToString()
                    });
                }
            }
            return new TableResult()
            {
                code = 0,
                count = purviews.Count(),
                data = purviews
            };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
    public class Purview
    {
        public int PurviewId { get; set; }
        public string PurviewName { get; set; }
    }

    public class TableResult
    {
        public int code { get; set; }

        public int count {get;set;}
        public List<Purview> data { get; set; }
    }
}
