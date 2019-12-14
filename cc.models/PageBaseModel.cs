using Newtonsoft.Json;

namespace cc.models
{
    public class PageBaseModel
    {
        [JsonProperty("limit")]
        public int PageSize { get; set; }

        [JsonProperty("page")]
        public int PageIndex { get; set; }
    }
}