import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { ReportService } from 'src/app/services/report.service';
import { saveAs } from 'file-saver';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-report-aliado',
  templateUrl: './report-aliado.page.html',
  styleUrls: ['./report-aliado.page.scss'],
})
export class ReportAliadoPage implements OnInit {

  public searchTerm!: string;
  public startDate!: string;
  public endDate!: string;
  public items: any[] = [];
  public qrCodeUrl!: string;
  public nombreAliado!:string;
  public rifAliado!: string;
  public paginatedItems: Report[] = [];
  public currentPage: number = 1;
  public pageSize: number = 5;
  public totalPages: number = 1;
  @ViewChild('qrContainer') qrContainer!: ElementRef;

  constructor(
    private reportService: ReportService,
    private toastController :  ToastController,
    private navController: NavController,
    private router: Router,
    private alertController: AlertController,
  ) { }

  public async getReportAliado() {
    const response = await (await this.reportService.getReportAliado()).toPromise();
    this.items = response.data[0]
    console.log(this.items);
  }

  async presentDeleteConfirm(cedula_rif: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este aliado?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteAliado(cedula_rif);
            this.toastMessage('Aliado eliminado exitosamente','success','checkmark-circle',2500)
            setTimeout(() => {
                window.location.reload()
            }, 3200);
          },
        },
      ],
    });

    await alert.present();
  }
  public getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  async downloadQRCode(item: any,nombre:any,rif:any) {
  this.nombreAliado = nombre;
  this.rifAliado = rif;
    this.qrCodeUrl = item;
    if (this.qrCodeUrl) {
      const qrContainer = this.qrContainer.nativeElement;
      qrContainer.style.display = 'block';
      setTimeout(() => {
        html2canvas(qrContainer, {
          useCORS: true,
          scale: 4,
        }).then(canvas => {
          qrContainer.style.display = 'none';
          canvas.toBlob(blob => {
            if (blob) {
              saveAs(blob, `QR_${nombre}.png`);
            } else {
              console.error('Error al generar la imagen del QR');
            }
          });
        }).catch(err => {
          console.error('Error al generar el canvas:', err);
          qrContainer.style.display = 'none';
        });
      }, 100);
    } else {
      console.error('No hay URL para el código QR');
    }
  }

  async downloadQRCodeAsPDF(item: any, nombre: any, rif: any) {
    this.nombreAliado = nombre;
    this.rifAliado = rif;
    this.qrCodeUrl = item;
  
    if (this.qrCodeUrl) {
      const qrContainer = this.qrContainer?.nativeElement;
  
      if (qrContainer) {
        // Hacer visible el contenedor para poder tomar la captura
        qrContainer.style.display = 'block'; // Asegúrate de que el contenedor es visible
  
        // Usamos setTimeout para asegurarnos de que la visibilidad se aplique correctamente
        setTimeout(() => {
          html2canvas(qrContainer, {
            useCORS: true,
            scale: 4,
          }).then(canvas => {
            qrContainer.style.display = 'none'; // Ocultar de nuevo el contenedor
  
            // Obtener datos de la imagen manteniendo proporciones
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 450; // Tamaño en mm (ajustable)
            const imgHeight = (canvas.height / canvas.width) * imgWidth; // Mantener proporción
  
            // Crear PDF tamaño A4
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
            });
  
            const pageWidth = 210;
            const pageHeight = 297;
  
            // Centramos el QR en la hoja
            const xPosition = (pageWidth - imgWidth) / 2;
            const yPosition = (pageHeight - imgHeight) / 2;
  
            // Agregar imagen al PDF
            pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgHeight);
  
            // Guardar PDF
            pdf.save(`${this.nombreAliado}.pdf`);
            this.toastMessage('QR descargado como PDF con éxito', 'success', 'checkmark-circle', 2800);
          }).catch(err => {
            console.error('Error al generar el canvas:', err);
            qrContainer.style.display = 'none'; // Ocultar si hay un error
          });
        }, 100); // Ajustar el tiempo de espera (100ms) si es necesario
      } else {
        console.error('No se pudo encontrar el contenedor del QR.');
      }
    } else {
      console.error('No hay URL para el código QR');
    }
  }
  
  

  async toastMessage(message: string, color: string, icon: string, duration:number) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      color: color,
      icon:icon,
      duration: duration,
    });
    await toast.present();
  }
  

  public async deleteAliado(item:any){
    const data = {
      cedula_rif : item
    }
    const response = await (await this.reportService.deleteAliado(data)).toPromise();
  }

  ngOnInit() {
    this.getReportAliado()
  }

  paginateItems() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateItems();
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateItems();
    }
  }

  public routingNavigate() {
    this.navController.navigateRoot('report')
  }

}
