import { Component, OnInit } from '@angular/core';
import { IotaApiService } from '../iotaApi.service';

const refreshIntervalSeconds = 60;

@Component({
    selector: 'app-nodeinfo',
    templateUrl: './nodeinfo.component.html',
    styleUrls: ['./nodeinfo.component.scss'],
})
export class NodeinfoComponent implements OnInit {

    nodeinfoTimer;
    nodeinfo;

    constructor(private iotaApi: IotaApiService) {
    }

    getNodeInfo() {
        this.iotaApi.getNodeInfo().subscribe(nodeinfo => {
            this.nodeinfo = nodeinfo;
        })
    }

    ngOnInit() {
        this.getNodeInfo();
        this.nodeinfoTimer = setInterval(() => {
            this.getNodeInfo();
        }, refreshIntervalSeconds * 1000);
    }
}
