import React, { Component } from "react";
import { ProfileScene } from "./ProfileScene";
import { ProfileSummary } from "./models/profile-summary";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TabPanel, TabView } from "primereact/tabview";
import Moment from "react-moment";
import {Indicator} from "./models/indicator";
import {Button} from "primereact/button";
import {Manifest} from "./models/manifest";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
const config = require("./IndicatorsConfig.json");
const messageConfig = require("./MessagesConfig.json");
import moment from "moment";

interface Prop {
  profile: ProfileSummary;
  indicators: Indicator[];
}
export class ProfileDetail extends Component<Prop, {}> {
  dateTemplate = (rowData: any, column: any) => {
    const dt = rowData["logDate"];
    return (
      <span>
        <Moment format="DD MMM YYYY">{dt}</Moment>
      </span>
    );
  };
  date2Template = (rowData: any, column: any) => {
    const dt = rowData["updated"];
    return (
      <span>
        <Moment format="DD MMM YYYY">{dt}</Moment>
      </span>
    );
  };

  date3Template = (rowData: any, column: any) => {
    const dt = rowData["report"];
    const ll = JSON.parse(JSON.stringify(rowData["measure"]));

    if (dt && dt === "Demo EMR") return <span></span>;
    if (dt && dt === "v1.0.0.0") return <span></span>;
    if (dt && dt.startsWith("1983")) return <span></span>;

    if (ll.display.startsWith("Last") && dt) {
      return (
        <span>
          <Moment format="DD MMM YYYY">{dt}</Moment>
        </span>
      );
    }
    return <span>{dt} </span>;
  };

  numExpTemplate = (rowData: any, column: any) => {
    const dt = Number(rowData["expected"]).toLocaleString();
    return (
        <span>
          {dt}
      </span>
    );
  };

  numRecTemplate = (rowData: any, column: any) => {
    const dt = Number(rowData["recieved"]).toLocaleString();
    return (
        <span>
          {dt}
      </span>
    );
  };

  render() {
    if (!this.props.profile || (this.props.profile && this.props.profile.summaries && this.props.profile.summaries.length===0)) {
      return <div/>;
    }
    else {

      const dwhSummaries = this.props.profile.summaries!.filter(
        (x) => x.docket.name === "NDWH" && x.extract.name!=="Detained"
      );

      const dwhNotSentSummaries = this.props.profile.summaries!.filter(
          (x) => x.docket.name === "NDWH" && x.extract.name=="Detained"
      );
      if (dwhNotSentSummaries && dwhNotSentSummaries.length>0) {
        let ms: any
        for (const [key, value] of Object.entries(messageConfig)) {
          if (key === 'Detained')
            ms = value;
        }
        dwhNotSentSummaries.map(x => (
            x.reason = `${ms}`
        ))
      }
      const htsSummaries = this.props.profile.summaries!.filter(
        (x) => x.docket.name === "HTS"
      );
      const mpiSummaries = this.props.profile.summaries!.filter(
        (x) => x.docket.name === "MPI"
      );
      const formattedSummary=(summr:any)=> {
        summr.extract.display= summr.extract.display
            .replace('Master Patient Index', 'Patient Key Values')
        return summr;
      }
      if (mpiSummaries && mpiSummaries.length>0) {
        mpiSummaries.map(x => (
            x = formattedSummary(x)
        ))
      }
      const mgsSummaries = this.props.profile.summaries!.filter(
        (x) => x.docket.name === "MGS"
      );

      const mnchSummaries = this.props.profile.summaries!.filter(
          (x) => x.docket.name === "MNCH"
      );

      const prepSummaries = this.props.profile.summaries!.filter(
          (x) => x.docket.name === "PREP"
      );

      const crsSummaries = this.props.profile.summaries!.filter(
          (x) => x.docket.name === "CRS"
      );

      const formattedMetrics=(met:any)=> {
        met.measure.display= met.measure.display
            .replace('Emr', 'EMR')
            .replace('Dwapi', 'DWAPI')
            .replace('MPI', 'PKV');

        met.measure.description= met.measure.description
            .replace('Emr', 'EMR')
            .replace('Dwapi', 'DWAPI')
            .replace('MPI', 'PKV');
        return met;
      }
      let facMetricsSummaries = [];
      let xfacMetricsSummaries = this.props.profile.metrics;
      if (xfacMetricsSummaries && xfacMetricsSummaries.length>0) {
        const dwapi=xfacMetricsSummaries.filter(x=>x.measure.name==="DwapiVersion")[0];
        if (dwapi) {
          facMetricsSummaries = xfacMetricsSummaries.filter(x => {
            var a = moment(dwapi.createDate);
            var b = moment(x.createDate);
            return a.diff(b, 'days') < 1
          })
          facMetricsSummaries.map(x => (
              x = formattedMetrics(x)
          ))
        }
      }


      // @ts-ignore
      this.props.profile.manifests.sort(function (a: Manifest, b: Manifest) {
        // @ts-ignore
        const logDateA = new Date(a.logDate.toString()).getTime();
        // @ts-ignore
        const logDateB = new Date(b.logDate.toString()).getTime();
        return logDateB - logDateA;
      });

      const dateBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
              <Moment format="DD MMM YYYY">{rowData.indicatorDate}</Moment>
            </React.Fragment>
        );
      }

      const dateBodyDwhTemplate = (rowData: any) => {
        if (rowData.dwhIndicatorDate) {
          return (
              <React.Fragment>
                <Moment format="DD MMM YYYY">{rowData.dwhIndicatorDate}</Moment>
              </React.Fragment>
          );
        } else {
          return null;
        }
      }

      const differenceFunc = (rowData: any) => {
        if (rowData.value && rowData.dwhValue) {
          const val = parseInt(rowData.value.replace(/,/g, ''), 10);
          const dwhVal = parseInt(rowData.dwhValue.replace(/,/g, ''), 10);
          const result= val - dwhVal;
          return Number(result).toLocaleString();
        } else {
          return null;
        }
      }

      let indicatorArray: any[] = [];
      const indicators = this.props.indicators;
      indicators.forEach(obj => {
        if(obj.name === "HTS_TST_POS") obj.name = "HTS_TESTED_POS";
      })
      const hiddenIndicators = [
        'TX_RTT', 'TX_ML', 'MMD', 'TX_PVLS', 'HTS_LINKED'
      ];
      for (const [key, value] of Object.entries(config)) {
        const indicatorValues = indicators.filter(obj => obj.name === key);
        if (indicatorValues && indicatorValues.length > 0) {
          indicatorValues.sort(function(a: any, b: any){
            // @ts-ignore
            return new Date(a.indicatorDate) - new Date(b.indicatorDate);
          });
          // @ts-ignore
          const val = value.toString();
          const description = key.toString();
          if(hiddenIndicators.indexOf(key) === -1) {
            indicatorArray.push(
              {
                dwhIndicatorDate: indicatorValues[indicatorValues.length - 1].dwhIndicatorDate,
                dwhValue: indicatorValues[indicatorValues.length - 1].dwhValue,
                indicatorDate: indicatorValues[indicatorValues.length - 1].indicatorDate,
                name: key ? key : null,
                description: val ? val: null,
                value: indicatorValues[indicatorValues.length - 1].value
              }
            );
          }
        }
      }

      const formatedInd=(ind:any)=> {
        ind.name=ind.name.split('_').join(' ');
        if (ind.value)
        {
          if (!['DB STATE', 'LAST ENCOUNTER CREATE DATE'].includes(ind.name)){
            ind.value=Number(ind.value).toLocaleString();
          }
        }
        if (ind.dwhValue)
        {
          ind.dwhValue=Number(ind.dwhValue).toLocaleString();
        }
        return ind;
      }

      if (indicatorArray && indicatorArray.length>0) {
        indicatorArray.map(x => (
            x = formatedInd(x)
        ))
      }

      const today = new Date();
      const lastYear = new Date();
      lastYear.setFullYear(today.getFullYear() - 1);
      lastYear.setDate(1);
      const manifests = this.props.profile.manifests;
      let filteredManifests: any = [];
      if (manifests && manifests.length > 0) {
        filteredManifests = manifests.filter(obj => obj.logDate ? new Date(obj.logDate).getTime() >= lastYear.getTime() : false);
      }

      filteredManifests.sort(function(a: any, b: any){
        // @ts-ignore
        return new Date(a.logDate) - new Date(b.logDate);
      });
      const categories: string[] = [];
      const ndwh_value = [];
      const hts_value = [];
      const mpi_value = [];
      const mgs_value = [];
      const mnch_value = [];
      const prep_value = [];
      const crs_value = [];
      for (const manifest of filteredManifests) {
        const logDate = new Date(manifest.logDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).replace(/ /g, '-');
        if (!categories.includes(logDate)) {
          categories.push(logDate);
        } else {
          continue ;
        }

        const dwh = filteredManifests.filter((obj: { docket: string; logDate: { toLocaleDateString: (arg0: string, arg1: { month: string; year: string; })
                => { replace: (arg0: RegExp, arg1: string) => string; }; }; }) => obj.docket === 'NDWH'
            && new Date(obj.logDate.toString()).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).replace(/ /g, '-') === logDate);

        if (dwh && dwh.length > 0) {
          ndwh_value.push(dwh[dwh.length -1].patientCount);
        } else {
          ndwh_value.push(null);
        }

        const hts = filteredManifests.filter((obj: { docket: string; logDate: { toLocaleDateString: (arg0: string, arg1: { month: string; year: string; })
                => { replace: (arg0: RegExp, arg1: string) => string; }; }; }) => obj.docket === 'HTS'
            && new Date(obj.logDate.toString()).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).replace(/ /g, '-') === logDate);

        if (hts && hts.length > 0) {
          hts_value.push(hts[hts.length -1].patientCount);
        } else {
          hts_value.push(null);
        }

        const mpi = filteredManifests.filter((obj: { docket: string; logDate: { toLocaleDateString: (arg0: string, arg1: { month: string; year: string; })
                => { replace: (arg0: RegExp, arg1: string) => string; }; }; }) => obj.docket === 'MPI'
            && new Date(obj.logDate.toString()).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).replace(/ /g, '-') === logDate);

        if (mpi && mpi.length > 0) {
          mpi_value.push(mpi[mpi.length -1].patientCount);
        } else {
          mpi_value.push(null);
        }

        const mnch = filteredManifests.filter((obj: { docket: string; logDate: { toLocaleDateString: (arg0: string, arg1: { month: string; year: string; })
                => { replace: (arg0: RegExp, arg1: string) => string; }; }; }) => obj.docket === 'MNCH'
            && new Date(obj.logDate.toString()).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).replace(/ /g, '-') === logDate);

        if (mnch && mnch.length > 0) {
          mnch_value.push(mnch[mnch.length -1].patientCount);
        } else {
          mnch_value.push(null);
        }

        const prep = filteredManifests.filter((obj: { docket: string; logDate: { toLocaleDateString: (arg0: string, arg1: { month: string; year: string; })
                => { replace: (arg0: RegExp, arg1: string) => string; }; }; }) => obj.docket === 'PREP'
            && new Date(obj.logDate.toString()).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).replace(/ /g, '-') === logDate);

        if (prep && prep.length > 0) {
          prep_value.push(prep[prep.length -1].patientCount);
        } else {
          prep_value.push(null);
        }

        const crs = filteredManifests.filter((obj: { docket: string; logDate: { toLocaleDateString: (arg0: string, arg1: { month: string; year: string; })
                => { replace: (arg0: RegExp, arg1: string) => string; }; }; }) => obj.docket === 'CRS'
            && new Date(obj.logDate.toString()).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).replace(/ /g, '-') === logDate);

        if (crs && crs.length > 0) {
          crs_value.push(crs[crs.length -1].patientCount);
        } else {
          crs_value.push(null);
        }
      }

      const getUploadHistoryOptions = {
        title: {
          text: 'Upload History'
        },

        subtitle: {
          text: ''
        },

        yAxis: {
          type: 'logarithmic',
          title: {
            text: 'Patient Count'
          }
        },

        xAxis: [{ categories: categories, title: { text: 'Months' }, crosshair: true }],

        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },

        plotOptions: {
        },

        series: [{
          name: 'C&T',
          data: ndwh_value
        }, {
          name: 'HTS',
          data: hts_value
        }, {
          name: 'PKV',
          data: mpi_value
        },{
          name: 'MNCH',
          data: mnch_value
        },{
          name: 'PREP',
          data: prep_value
        },{
          name: 'CRS',
          data: crs_value
        }],

        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      }

      const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
      const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

      return (
        <div>
          <div className="p-grid">
            <div className="p-col-12">
              <Card title={this.props.profile.name}>
                <div className="p-grid">
                  <div className="p-col-1">Code</div>
                  <div className="p-col-2">{this.props.profile.code}</div>
                </div>
              </Card>
            </div>
            <div className={'p-grid'}>
              <div className="p-col-8">
                <TabView>
                  <TabPanel header="NDWH">
                    <DataTable value={dwhSummaries}>
                      <Column field="extract.display" header="Extract" />
                      <Column field="recieved" header="Recieved" body={this.numRecTemplate}/>
                      <Column field="expected" header="Expected" body={this.numExpTemplate} />
                      <Column
                          field="updated"
                          header="Update"
                          body={this.date2Template}
                      />
                    </DataTable>
                    <br/>
                    {dwhNotSentSummaries.length>0 &&
                    <DataTable value={dwhNotSentSummaries}>
                      <Column field="extract.display" header="Summary" />
                      <Column field="expected" header="Count" body={this.numExpTemplate}/>
                      <Column field="reason" header="Reason"/>
                      <Column field="" header=""/>
                    </DataTable>}
                  </TabPanel>

                  <TabPanel header="HTS">
                    <DataTable value={htsSummaries}>
                      <Column field="extract.display" header="Extract" />
                      <Column field="recieved" header="Recieved" body={this.numRecTemplate}/>
                      <Column field="expected" header="Expected" body={this.numExpTemplate}/>
                      <Column
                          field="updated"
                          header="Update"
                          body={this.date2Template}
                      />
                    </DataTable>
                  </TabPanel>

                  <TabPanel header="PKV">
                    <DataTable value={mpiSummaries}>
                      <Column field="extract.display" header="Extract" />
                      <Column field="recieved" header="Recieved" body={this.numRecTemplate}/>
                      <Column field="expected" header="Expected" body={this.numExpTemplate}/>
                      <Column
                          field="updated"
                          header="Update"
                          body={this.date2Template}
                      />
                    </DataTable>
                  </TabPanel>
                  {/*<TabPanel header="MGS">*/}
                  {/*  <DataTable value={mgsSummaries}>*/}
                  {/*    <Column field="extract.display" header="Extract" />*/}
                  {/*    <Column field="recieved" header="Recieved" />*/}
                  {/*    <Column field="expected" header="Expected" />*/}
                  {/*    <Column*/}
                  {/*        field="updated"*/}
                  {/*        header="Update"*/}
                  {/*        body={this.date2Template}*/}
                  {/*    />*/}
                  {/*  </DataTable>*/}
                  {/*</TabPanel>*/}
                  <TabPanel header="MNCH">
                    <DataTable value={mnchSummaries}>
                      <Column field="extract.display" header="Extract" />
                      <Column field="recieved" header="Recieved" body={this.numRecTemplate}/>
                      <Column field="expected" header="Expected" body={this.numExpTemplate}/>
                      <Column
                          field="updated"
                          header="Update"
                          body={this.date2Template}
                      />
                    </DataTable>
                  </TabPanel>
                  <TabPanel header="PREP">
                    <DataTable value={prepSummaries}>
                      <Column field="extract.display" header="Extract" />
                      <Column field="recieved" header="Recieved" body={this.numRecTemplate}/>
                      <Column field="expected" header="Expected" body={this.numExpTemplate}/>
                      <Column
                          field="updated"
                          header="Update"
                          body={this.date2Template}
                      />
                    </DataTable>
                  </TabPanel>
                  <TabPanel header="CRS">
                    <DataTable value={crsSummaries}>
                      <Column field="extract.display" header="Extract" />
                      <Column field="recieved" header="Recieved" body={this.numRecTemplate}/>
                      <Column field="expected" header="Expected" body={this.numExpTemplate}/>
                      <Column
                          field="updated"
                          header="Update"
                          body={this.date2Template}
                      />
                    </DataTable>
                  </TabPanel>
                </TabView>
              </div>
              <div className="p-col-4">
                <HighchartsReact highcharts={Highcharts} options={getUploadHistoryOptions} />
              </div>
            </div>
            <div className={'p-grid'}>
              <div className="p-col-8">
                <DataTable
                    value={facMetricsSummaries}
                    header="Facility Metrics"
                >
                  <Column field="measure.display" header="Metric" />
                  <Column
                      field="report"
                      header="Value"
                      body={this.date3Template}
                  />
                  <Column field="measure.description" header="Description" />
                </DataTable>
              </div>
            </div>
            <div className={'p-grid'}>
              <div className={'p-col-8'}>
                <DataTable
                value={indicatorArray}
                header={'Indicator Metrics'}>
                  <Column field={'name'} header={'Indicator Name'} className={'word-wrap'} />
                  <Column field={'description'} header={'Indicator Description'} className={'word-wrap'} />
                  <Column field={'indicatorDate'} header={'EMR Indicator Date'} body={dateBodyTemplate} />
                  <Column
                      field={'value'} header={'EMR Value'}
                  />
                  <Column field={'dwhValue'} header={'NDWH Calculation'} />
                  <Column field={'dwhIndicatorDate'} header={'NDWH Date'} body={dateBodyDwhTemplate} />
                  <Column field={'value'} header={'Difference'} body={differenceFunc} />
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
