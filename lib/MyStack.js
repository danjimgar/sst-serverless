import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create the table
    const table = new sst.Table(this, "Assets", {
      fields: {
        id: sst.TableFieldType.STRING,
        mediaType: sst.TableFieldType.STRING,
        source: sst.TableFieldType.STRING,
        title: sst.TableFieldType.STRING,
        description: sst.TableFieldType.STRING,
        length: sst.TableFieldType.STRING,
        aspectRatio: sst.TableFieldType.STRING,
        topic: sst.TableFieldType.STRING,
        contentUrl: sst.TableFieldType.STRING,
        previewUrl: sst.TableFieldType.STRING,
        totalVotes: sst.TableFieldType.NUMBER,
        totalRating: sst.TableFieldType.NUMBER,
      },
      primaryIndex: { partitionKey: "id" },
    });

    // Create the HTTP API
    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        // Pass in the table name to our API
        environment: {
          tableName: table.dynamodbTable.tableName,
        },
      },
      routes: {
        "GET    /assets"      : "src/assets.main",
        "POST    /assets/{id}/vote/{vote}" : "src/update.main",
      },
    });

    // Allow the API to access the table
    api.attachPermissions([table]);

    // Show the API endpoint in the output
    // Deploy our React app
    const site = new sst.ReactStaticSite(this, "ReactSite", {
      path: "frontend",
      environment: {
        // Pass in the API endpoint to our app
        REACT_APP_API_URL: api.url,
      },
    });

    // Show the URLs in the output
    this.addOutputs({
      SiteUrl: site.url,
      ApiEndpoint: api.url,
    });
  }
}