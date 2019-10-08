namespace cc.models
{
    using System.Collections.Generic;
    public class TableResult
    {
        public int code { get; set; }

        public int count { get; set; }
        public List<Purview> data { get; set; }
    }
}