using System.Collections.Generic;
using cc.dll;
using cc.models;
namespace cc.bll
{
    public class DataHandler
    {
        public T GetList<T>() where T : TableResult, new()
        {
            GetData getData = new GetData();
            return getData.GetList<T>();
        }
    }
}