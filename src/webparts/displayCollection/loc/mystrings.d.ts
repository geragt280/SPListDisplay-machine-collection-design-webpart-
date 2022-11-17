declare interface IDisplayCollectionWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'DisplayCollectionWebPartStrings' {
  const strings: IDisplayCollectionWebPartStrings;
  export = strings;
}
