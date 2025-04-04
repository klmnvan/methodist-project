using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using System.Reflection;

namespace Methodist_API.Dtos.Patch
{
    public class PatchRequestContractResolver : CamelCasePropertyNamesContractResolver
    {
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            var prop = base.CreateProperty(member, memberSerialization);

            prop.SetIsSpecified += (o, o1) =>
            {
                if (o is PatchDtoBase patchDtoBase)
                {
                    patchDtoBase.SetHasProperty(prop.PropertyName);
                }
            };

            return prop;
        }
    }
}
