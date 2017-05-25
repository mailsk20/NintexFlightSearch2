using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(NintexFlightSearch.Startup))]
namespace NintexFlightSearch
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
