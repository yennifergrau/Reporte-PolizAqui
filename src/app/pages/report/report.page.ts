  import { Component, OnInit } from '@angular/core';
  import { Report } from '../../models/reportInterface';
  import { ReportService } from 'src/app/services/report.service';
  import { jsPDF } from 'jspdf';
  import html2canvas from 'html2canvas';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

  @Component({
    selector: 'app-report',
    templateUrl: './report.page.html',
    styleUrls: ['./report.page.scss'],
  })
  export class ReportPage implements OnInit {

    public items: Report[] = [];
    public filteredItems: Report[] = [];
    public searchTerm!: string;
    public startDate!: string;
    public endDate!: string;
    private reporteSeleccionado: Report[] = [];
    loading: boolean = false;
    public documento: any;
    public paginatedItems: Report[] = [];
    public currentPage: number = 1;
    public pageSize: number = 5;
    public totalPages: number = 1;

    constructor(
      private reportService: ReportService,
      private navController: NavController,
      private router: Router
    ) { }

    ngOnInit() {
      this.getReport();
    }

    toggleDetalles(reporte: any) {
      reporte.mostrarDetalles = !reporte.mostrarDetalles;

      this.items.forEach((c: { mostrarDetalles: boolean; }) => {
        if (c !== reporte) {
          c.mostrarDetalles = false;
        }
      });
    }

    mostrarDetalles(reporte: any) {
      this.reporteSeleccionado = reporte;
    }

    private getReport() {
      this.reportService.getReportData().subscribe(data => {
        const pagos = data.data.pagos;
        const polizas = data.data.polizas;
        const matchedRecords = polizas.map((poliza: {
          monto: any; numero_poliza: any; titular: any; titular_apellido: any; telefono: any; fecha_emision: any; estado_poliza: any; plan: any; aseguradora: any 
}) => {
          const pago = pagos.find((pago: { id_poliza: any; }) => pago.id_poliza === poliza.numero_poliza);
    
          return {
            id_poliza: poliza.numero_poliza,
            nombre: poliza.titular,
            apellido: poliza.titular_apellido,
            telefono: poliza.telefono,
            fecha_emision: poliza.fecha_emision,
            estado_poliza: poliza.estado_poliza,
            plan: poliza.plan,
            aseguradora: poliza.aseguradora,
            empresa: pago ? pago.empresa : null,
            referencia: pago ? pago.referencia : 'Sin referencia',
            metodo_pago: pago ? pago.metodo_pago : '',
            monto_pago: poliza.monto,
            sypago: pago ? pago.sypago : null
          };
        });
        this.items = matchedRecords.sort((a:any, b:any) => new Date(b.fecha_emision).getTime() - new Date(a.fecha_emision).getTime());
        this.updatePagination();
      });
    }
    
    filterTransactions() {
      const searchTerm = this.searchTerm.toLowerCase();
      this.filteredItems = this.items.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm) ||
        item.telefono.includes(searchTerm) ||
        item.id_pago.toString().includes(searchTerm) ||
        item.referencia.toLowerCase().includes(searchTerm)
      );
      this.updatePagination();
    }
  
    filterByDate() {
      if (!this.startDate || !this.endDate) return;
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      this.filteredItems = this.items.filter(item => {
        const itemDate = new Date(item.fecha_emision);
        return itemDate >= start && itemDate <= end;
      }).sort((a, b) => new Date(b.fecha_emision).getTime() - new Date(a.fecha_emision).getTime());
      
      this.updatePagination();
    }

    updatePagination() {
      this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
      this.currentPage = 1;
      this.paginateItems();
    }
  
    paginateItems() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedItems = this.filteredItems.slice(startIndex, endIndex);
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.paginateItems();
      }
    }
  
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.paginateItems();
      }
    }


navigateTo(route: string): void {
  this.router.navigate([route]);
}

    getMetodoPagoTexto(metodo: string): string {
      switch (metodo) {
        case 'CELE':
          return 'Pago Móvil';
        case 'CNTA':
          return 'Transferencia Bancaria';
        default:
          return metodo; 
      }
    }

    exportToPDF() {
      const data : any = document.querySelector('.tabla');
      if (data) {
        html2canvas(data).then(canvas => {
          const imgWidth = 208;
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          const heightLeft = imgHeight;
          const doc = new jsPDF('p', 'mm', 'a4');
          let position = 0;
          doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          position += heightLeft;
          doc.save('report.pdf');
        });
      } else {
        console.error('No se encontró el contenedor de datos.');
      }
    }

    public routingReportAliado() {
      this.navController.navigateRoot('report-aliado')
    }

  }
