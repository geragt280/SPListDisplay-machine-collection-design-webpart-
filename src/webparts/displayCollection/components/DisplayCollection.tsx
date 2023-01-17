import * as React from 'react';
import styles from './DisplayCollection.module.scss';
import { IDisplayCollectionProps } from './IDisplayCollectionProps';
import { Check, css, PrimaryButton, TextField } from 'office-ui-fabric-react';
import { ListItemModel } from './ListItemModel';
import ItemCard from './ItemCard/ItemCard';
import { Guid } from '@microsoft/sp-core-library';
import { PagedItemCollection } from '@pnp/sp/items';
import Select from 'react-select';

interface DisplayCollectionStates {
  Items : ListItemModel[];
  currentPage: number;
  totalPages: number;
  selectedfilterItem: { value?:string, label?:string };
  filterItems: { value?:string, label?:string }[];
  sortItems: { value?:string, label?:string }[];
  selectedSortItem: { value?:string, label?:string };
  searchedText: string;
  pagingContext: PagedItemCollection<ListItemModel[]>;
  pagingContextArray: PagedItemCollection<ListItemModel[]>[];
}

export default class DisplayCollection extends React.Component<IDisplayCollectionProps, DisplayCollectionStates> {

  constructor(props){
    super(props);

    this.state = { 
      Items: [],
      currentPage: 1,
      totalPages: 1,
      selectedfilterItem: null,
      filterItems: [],
      searchedText: "",
      pagingContext: null,
      pagingContextArray: [],
      sortItems: [
        {
          label: "None", 
          value: "None"
        },
        {
          label: "New to Older", 
          value: "New to Older"
        },
        {
          label: "Old to Newer", 
          value: "Old to Newer"
        }
      ],
      selectedSortItem: {
        label: "New to Older", 
        value: "New to Older"
      }
    };
  }

  private SPLIST_ID = this.props.listId;
  private SPLISTPAGINGCOUNT = this.props.pagingItems ? this.props.pagingItems : 8;

  private async  _onClickNext(){
    console.log("Next");

    //pushing current pagingContext into pagingContext array state
    this.state.pagingContextArray.push(this.state.pagingContext)

    const items = await this.state.pagingContext.getNext();

    this.setState({
      pagingContext: items,
      Items: items.results,
      currentPage: this.state.currentPage + 1,
      totalPages: this.state.totalPages + 1
    });
    // console.log("items", items);
  }

  private async  _onClickPrev(){
    console.log("Prev");

    //poping current pagingContext from pagingContext array state
    const items = this.state.pagingContextArray.pop();

    this.setState({
      pagingContext: items,
      Items: items.results,
      currentPage: this.state.currentPage - 1,
      totalPages: this.state.totalPages - 1
    });
    // console.log("items", items);
  }

  componentDidUpdate(prevProps) {
    const { field1, field2, field3, field4 } = this.props;
    if (field1 !== prevProps.field1 || field2 != prevProps.field2 || field3 != prevProps.field3 || field4 != prevProps.field4 ) {
      console.log("forced update", field1, field2, field3, field4);
      if(field1 != "" && field2 != "" && field3 != "" && field4 != ""){
        this.GetListItems();
        this.GetChoiceFields();
      }
    }
  }

  private _SearchedTextChanged = (e) => {
    this.setState({
      searchedText: e.target.value,
      selectedfilterItem: null
    })
    this.GetSearchItems(e.target.value);
  }

  public componentDidMount(): void {
    const { field1, field2, field3 } = this.props;
    // console.log("got inside didmount", field1, field2, field3);
    // if(field1 != "" && field2 != "" && field3 != ""){
      this.GetListItems();
      this.GetChoiceFields();
    // }
    window.localStorage.clear();
    // console.log("componentDidMount ran", this.SPLIST_ID);
  }

  GetListItems = async () => {
    const listInfo = await this.props.pnpsp.web.lists.getById(this.SPLIST_ID);
    let items: PagedItemCollection<ListItemModel[]> = null;
    if (this.state.selectedSortItem != null) {
      if (this.state.selectedSortItem.value != "None") {
        let ascendingOrder = this.state.selectedSortItem.label === "Old to Newer";
        items = await listInfo.items.top(this.SPLISTPAGINGCOUNT).orderBy(this.props.field3, ascendingOrder).getPaged();
      }
      else
        items = await listInfo.items.top(this.SPLISTPAGINGCOUNT).getPaged();
    }
    else{
      items = await listInfo.items.top(this.SPLISTPAGINGCOUNT).getPaged();
    }
    // console.log("List information", items.results);
    this.setState({
      pagingContext: items,
      Items: items.results,
      pagingContextArray: [],
      currentPage: 0,
      totalPages: 0,
      selectedfilterItem: null,
      searchedText: ""
    });
  }

  GetChoiceFields = async () => {
    const list = this.props.pnpsp.web.lists.getById(this.SPLIST_ID);
    const r = await list.fields.getByInternalNameOrTitle(this.props.field2)();
    // console.log("Fields", r);
    let choiceItems : { value?:string, label?:string }[] = [];
    if (r.Choices.length) {
      r.Choices.map(e => choiceItems.push({label:e, value:e}))
      this.setState({
        filterItems: choiceItems
      });
    }
  }

  GetSearchItems = async (searchName) => {
    // console.log("searchName", searchName);

    if (searchName != null && searchName != "") {
      const listInfo = await this.props.pnpsp.web.lists.getById(this.SPLIST_ID);
      let items: PagedItemCollection<ListItemModel[]> = null;
      if (this.state.selectedSortItem != null) {
        if (this.state.selectedSortItem.value != "None") {
          let ascendingOrder = this.state.selectedSortItem.label === "Old to Newer";
          items = await listInfo.items.filter(`substringof('${searchName}', Title)`).orderBy(this.props.field3, ascendingOrder).top(this.SPLISTPAGINGCOUNT).getPaged();  
        }
        else
          items = await listInfo.items.filter(`substringof('${searchName}', Title)`).top(this.SPLISTPAGINGCOUNT).getPaged();
      }
      else
        items = await listInfo.items.filter(`substringof('${searchName}', Title)`).top(this.SPLISTPAGINGCOUNT).getPaged();
      if (items.results.length > 0) {
        this.setState({
          pagingContext: items,
          Items: items.results,
          pagingContextArray: [],
          currentPage: 0,
          totalPages: 0
        });
      }
    }
    else{
      this.GetListItems();
    }
  
  }

  GetFilteredItems = async (filterName) => {
    // console.log("filtername", filterName);
    // console.log("Sorted item", this.state.selectedSortItem);
    if (filterName != null) {
      const listInfo = await this.props.pnpsp.web.lists.getById(this.SPLIST_ID);
      let items: PagedItemCollection<ListItemModel[]> = null;
      if(this.state.selectedSortItem != null){
        if (this.state.selectedSortItem.value != "None") {
          let ascendingOrder = this.state.selectedSortItem.label === "Old to Newer";
          console.log("Ascending Order", ascendingOrder);
          items = await listInfo.items.filter(`${this.props.field2} eq '${filterName.label}'`).orderBy(this.props.field3, ascendingOrder).top(this.SPLISTPAGINGCOUNT).getPaged(); 
        }else
          items = await listInfo.items.filter(`${this.props.field2} eq '${filterName.label}'`).top(this.SPLISTPAGINGCOUNT).getPaged();          
      }else{
        items = await listInfo.items.filter(`${this.props.field2} eq '${filterName.label}'`).top(this.SPLISTPAGINGCOUNT).getPaged();
      }
      // console.log("List information", items.results);
      this.setState({
        pagingContext: items,
        Items: items.results,
        pagingContextArray: [],
        currentPage: 0,
        totalPages: 0
      });
    }
    else{
      this.GetListItems();
    }
  
  }

  private RenderPersonalCard = (item) => {
    return (
      <div className={css(styles.column, styles.mslg3)} 
      style={{
        // boxShadow:'1px 1px 5px lightblue'
        width: 275,
        marginRight:20,
        marginBottom: 20
      }} 
      >
        <ItemCard item={item} key={Guid.newGuid().toString()} field1={this.props.field1} field2={this.props.field2} field3={this.props.field3} field4={this.props.field4} />
      </div>
    );
  }

  private onFilterChange = (e) => {
    // console.log("entered", e);
    this.setState({
      selectedfilterItem: e,
      searchedText: ""
    });

    this.GetFilteredItems(e);
  }

  private onSortChange = (e : {label:string; value:string}) => {
    // console.log("sort action", e);

    this.setState({
      selectedSortItem: e
    });
    
    if (this.state.selectedfilterItem != null) {
      this.GetFilteredItems(this.state.selectedfilterItem)
    }else if (this.state.searchedText != "" && this.state.searchedText != null) {
      // console.log("Searched item sort");
      this.GetSearchItems(this.state.searchedText);
    }else
      this.GetListItems();
  }

  public render(): React.ReactElement<IDisplayCollectionProps> {
    const { field1, field2, field3, field4 } = this.props;
    return (
      <section className={css(styles.grid, styles.displayCollection)}>
        <h1>{this.props.wptitle != "" ? this.props.wptitle : "Webpart Title" }</h1>
                
        <div 
        // style={{width:1405}}
        >
          <div className={css(styles.row, styles.filters)}>
            <div className={css(styles.column, styles.mslg12, styles.panel)}>
              <div className={styles.filterContainer}>
                <div>
                  <TextField label='Search' className={styles.searchBarStyle} value={this.state.searchedText} onChange={this._SearchedTextChanged}  />
                </div>
                <div>
                  <p className={styles.filterLabel}>Filter</p>
                  <Select options={this.state.filterItems}  className={styles.filterStyle} onChange={this.onFilterChange} placeholder='Select Application' isClearable={true} value={this.state.selectedfilterItem}/>
                </div>
                <div>
                  <p className={styles.filterLabel}>Sort by date</p>
                  <Select options={this.state.sortItems}  className={styles.filterStyle} onChange={this.onSortChange} placeholder='Sort type' isClearable={true} value={this.state.selectedSortItem}/>
                </div>
              </div>  
            </div>          
          </div>
          <div className={styles.row} >
            {
              field1 != "" && field2 != "" && field3 != "" && field4 != "" ? 
                this.state.Items.map( currentItem => this.RenderPersonalCard(currentItem)) :
                <></>
            }
          </div>
          <div className={css(styles.row, styles.pagination)} >
            <div className={css(styles.column, styles.mslg12, styles.panel)}>
              <div className={styles.panelBody}>
                {this.state.pagingContext != null ? <ul className={styles.pager}>
                  { this.state.pagingContextArray.length > 0 ? <li>
                    <PrimaryButton 
                      // disabled={((this.state.currentPage - 1) * this.props.pageSize + 1) <= 1} 
                      onClick={this._onClickPrev.bind(this)}
                      >Previous</PrimaryButton>
                  </li> : <li></li>}
                  { this.state.pagingContext.hasNext ? <li>
                    <PrimaryButton 
                      // disabled={((this.state.currentPage - 1) * this.props.pageSize) + this.state.items.length >= this.state.itemCount} 
                      onClick={this._onClickNext.bind(this)}
                      >Next</PrimaryButton>
                  </li> : <li></li> }
                </ul> : <></>}
              </div></div>
          </div>
        </div>
      </section>
    );
  }
}
