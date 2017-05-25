using System.Web;
using System.Web.Optimization;

namespace NintexFlightSearch
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/css/bootstrap").Include(
                      "~/Content/Bootstrap/bootstrap.css"));

            bundles.Add(new StyleBundle("~/Content/css/kendo").Include(
                      "~/Content/Kendo/kendo.common.min.css",
                      "~/Content/Kendo/kendo.default.min.css",
                      "~/Content/Kendo/kendo.min.css",
                      "~/Content/Kendo/kendo.UI.css"));

            bundles.Add(new StyleBundle("~/Content/css/font-awesome").Include(
                      "~/Content/font-awesome.min.css"));

            bundles.Add(new StyleBundle("~/Content/css/custom").Include(
                      "~/Content/Custom/site.css"));


            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jQuery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jQuery/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/Bootstrap/bootstrap.js",
                      "~/Scripts/Bootstrap/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/kendo").Include(
                      "~/Scripts/Kendo/kendo.all.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                      "~/Scripts/ViewModels/App/App.js",
                      "~/Scripts/ViewModels/App/Layout.js",
                      "~/Scripts/ViewModels/App/Validation.js"));
        }
    }
}
