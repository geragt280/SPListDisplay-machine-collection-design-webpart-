export interface ListItemModel {
  Title?: string;
  Link?: {
    Description?: string;
    Url: string;
  };
  Application?: string;
  Image?: string;
  LaunchDate?: Date;
}