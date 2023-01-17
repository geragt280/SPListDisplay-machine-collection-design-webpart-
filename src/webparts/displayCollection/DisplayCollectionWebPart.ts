import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPFI, spfi, SPFx } from "@pnp/sp";
import { IFieldInfo } from '@pnp/sp/fields/types';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields/list";
import * as strings from 'DisplayCollectionWebPartStrings';
import DisplayCollection from './components/DisplayCollection';
import { IDisplayCollectionProps } from './components/IDisplayCollectionProps';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import NoListSelected from './components/NoListSelected';

export interface IDisplayCollectionWebPartProps {
  listid: string;
  wptitle: string;
  pagingItems: number;
  lists: string;
  ListFields: IFieldInfo[];
  multiSelect: string[];
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

export default class DisplayCollectionWebPart extends BaseClientSideWebPart<IDisplayCollectionWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private sp : SPFI;
  private fieldDropdownDisabled: boolean = true;
  DropdownItems: IPropertyPaneDropdownOption[];

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit().then(_ => {
      this.sp = spfi().using(SPFx(this.context));
    });  
  }

  public render(): void {

    let element: React.ReactElement<IDisplayCollectionProps> = null;

    if(this.properties.lists == ""){
      element = React.createElement(
        NoListSelected, {
          listId: this.properties.lists,
          isDarkTheme: this._isDarkTheme,
          environmentMessage: this._environmentMessage,
          hasTeamsContext: !!this.context.sdks.microsoftTeams,
          userDisplayName: this.context.pageContext.user.displayName,
          pnpsp: this.sp,
          wptitle: this.properties.wptitle,
          pagingItems: this.properties.pagingItems,
          field1: this.properties.field1,
          field2: this.properties.field2,
          field3: this.properties.field3,
          field4: this.properties.field4
        }
      );
    }else{
      element = React.createElement(
        DisplayCollection,
        {
          listId: this.properties.lists,
          isDarkTheme: this._isDarkTheme,
          environmentMessage: this._environmentMessage,
          hasTeamsContext: !!this.context.sdks.microsoftTeams,
          userDisplayName: this.context.pageContext.user.displayName,
          pnpsp: this.sp,
          wptitle: this.properties.wptitle,
          pagingItems: this.properties.pagingItems,
          field1: this.properties.field1,
          field2: this.properties.field2,
          field3: this.properties.field3,
          field4: this.properties.field4
        }
      );
    }

    ReactDom.render(element, this.domElement);
  }

  protected onPropertyPaneConfigurationStart(): void {
    // console.log("pare ran");
    if (this.DropdownItems != null || (this.properties.lists!="" || this.properties.lists!=undefined)) {
      return
    }

    // this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'field1');
    // this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'field2');
    // this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'field3');

    

    this.loadLists()
      .then((listOptions: IPropertyPaneDropdownOption[]): void => {
        this.DropdownItems = listOptions;
        this.fieldDropdownDisabled = false;
        this.context.propertyPane.refresh();
//         this.context.propertyPane.close();
// this.context.propertyPane.open();
        // this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.render();
    });
    
  }


  private loadLists(): Promise<IPropertyPaneDropdownOption[]> {
    this.DropdownItems = null;
    return new Promise<IPropertyPaneDropdownOption[]>((resolve: (options: IPropertyPaneDropdownOption[]) => void, reject: (error: any) => void) => {
      
      if(this.properties.lists!="" || this.properties.lists!=undefined){
        setTimeout( async () => {
          let list = await this.sp.web.lists.getById(this.properties.lists).fields();
          // console.log("List", list);
          let fields : {key: string | number; text: string; index?: number; type?: any;}[] = [];
          list.map(e =>{  
            const index = fields.map(object => object.text).indexOf(e.Title);
            // console.log('pushed', e.Title, index);
            if (index == -1) {
              fields.push({
                key: e.EntityPropertyName,
                text: e.Title
              });
            }
          });
            resolve(fields);
        }, 2000);
      }
      else
        resolve(null);
      
    });
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    console.log("Field changed", propertyPath);

    if(propertyPath == "lists"){
      
      this.loadLists()
      .then((listOptions: IPropertyPaneDropdownOption[]): void => {
        this.DropdownItems = listOptions;
        this.fieldDropdownDisabled = false;
        this.context.propertyPane.refresh();
        this.render();
    });
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('wptitle', {
                  label: "Web Part Title"
                }),
                PropertyFieldListPicker('lists', {
                  label: 'Select a list',
                  selectedList: this.properties.lists,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  multiSelect: false,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyPaneTextField('pagingItems', {
                  label: "Paging Item Size",
                  value: "8",
                  maxLength: 2,
                  placeholder: "1-99"
                }),
                PropertyPaneDropdown('field1', {
                  label: "Select Title Column",
                  options: this.DropdownItems,
                  disabled: this.fieldDropdownDisabled,
                  selectedKey: 1
                }),
                PropertyPaneDropdown('field2', {
                  label: "Select Application Choice Column",
                  options: this.DropdownItems,
                  disabled: this.fieldDropdownDisabled,
                  selectedKey: 1
                }),
                PropertyPaneDropdown('field3', {
                  label: "Select Date Column",
                  options: this.DropdownItems,
                  disabled: this.fieldDropdownDisabled,
                  selectedKey: 1
                }),
                PropertyPaneDropdown('field4', {
                  label: "Select Classification Column",
                  options: this.DropdownItems,
                  disabled: this.fieldDropdownDisabled,
                  selectedKey: 1
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
