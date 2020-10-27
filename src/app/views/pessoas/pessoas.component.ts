import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PessoasService } from 'src/app/services/pessoas.service';
import { Validacoes } from 'src/app/validators/Validacoes';
import { environment } from 'src/environments/environment';

import swal from 'sweetalert2';
import * as moment from 'moment';

declare const M;

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {

  private urlEndPoint = `${environment.API_URL}/pessoa`;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  length = 0;

  pageSize = 10;

  @ViewChild('paginator') paginator: MatPaginator;

  public loading: boolean;

  public displayedColumns: string[] = ['Nome', 'CPF', 'E-mail', 'nascimento', 'acoes'];

  pessoaForm: FormGroup;

  pessoaParaEdicao: any;

  pessoaParaExclusao: any;

  nomeBusca: string;

  cpfBusca: string;

  emailBusca: string;

  dataBusca: string;

  constructor(private formBuilder: FormBuilder, 
              private pessoasService: PessoasService) { 
      this.initPessoaForm();
  }

  ngOnInit(): void {
    this.initMaterializeComponents();
    this.findAll(0, 10);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = this.getRangeLabel;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
  }

  initMaterializeComponents() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals, { dismissible: false });
  }

  initPessoaForm() {
    this.pessoaForm = this.formBuilder.group({
      "id": [undefined],
      "nome": [
        undefined,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150)
        ])
      ],
      "cpf": [
        undefined,
        Validators.compose([
          Validators.required,
          Validacoes.ValidaCpf,
          Validators.minLength(11),
          Validators.maxLength(14),
        ])
      ],
      "email": [
        undefined,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(5),
          Validators.maxLength(150),
        ])
      ],
      "nascimento": [
        undefined,
        Validators.compose([
          Validators.required
        ])
      ],
      "foto": [
        undefined, 
        Validators.compose([
          Validators.required
        ])  
      ]
    });
  }

  async save() {
    if (this.pessoaForm.valid) {
      let { nome, cpf, email, foto, nascimento } = this.pessoaForm.controls;

      let pessoa: any = {
        nome: nome.value,
        cpf: cpf.value,
        email: email.value,
        dataNascimento: nascimento.value,
      }

      await this.toBase64(foto.value).then((base64) => {
        pessoa['foto'] = base64;
      }).catch(() => {
        swal.fire({
          icon: 'error',
          title: 'Erro ao salvar imagem',
        });
      });

      if (this.pessoaParaEdicao) {
        pessoa.id = this.pessoaParaEdicao.id;

        this.pessoasService.update(pessoa).subscribe(() => {
          this.pessoaForm.reset()
          this.findAll(0, 10)
          this.pessoaParaEdicao = null;

          swal.fire({
            icon: 'success',
            title: 'Pessoa editada com sucesso'
          });
        }, (error) => {
          this.pessoaParaEdicao = null;
          swal.fire({
            icon: 'error',
            title: 'Erro ao editar pessoa',
            text: error.error.message
          });
        })
      } else {
        this.pessoasService.save(pessoa).subscribe(() => {
          this.pessoaForm.reset()
          this.findAll(0, 10)
          this.pessoaParaEdicao = null;

          swal.fire({
            icon: 'success',
            title: 'Pessoa salva com sucesso'
          });
        }, (error) => {
          this.pessoaParaEdicao = null;
          swal.fire({
            icon: 'error',
            title: 'Erro ao salvar pessoa',
            text: error.error.message
          });
        })
      }
    } else {
      swal.fire({
        icon: 'error',
        title: 'Erro ao salvar pessoa'
      });
    }
  }

  filtrar() {
    this.loading = true;

    this.pessoasService.filter(this.nomeBusca, this.cpfBusca, 
                                this.emailBusca, this.dataBusca).subscribe((response) => {
      this.popularTabela(response['content'], response['totalElements']);
      this.loading = false;
    }, (error) => {
      this.loading = false;
      swal.fire({
        icon: 'error',
        title: 'Erro ao aplicar filtro',
        text: error.error.message
      });
    });
  }

  findAll(page: number, rows: number) {
    this.loading = true;

    this.pessoasService.findAll(page, rows).subscribe((response) => {
      this.popularTabela(response['content'], response['totalElements']);
      this.loading = false;
    }, (error) => {
      swal.fire({
        icon: 'error',
        title: 'Erro ao buscar listagem de pessoas'
      });
      this.loading = false;
    })
  }

  delete(id: number) {
    this.loading = true;

    this.pessoasService.delete(id).subscribe(() => {
      this.findAll(0, 10);
    }, (error) => {
      swal.fire({
        icon: 'error',
        title: 'Erro ao apagar pessoa',
        text: error.error.message
      });
      this.loading = false;
    })
  }

  setPessoaParaEdicao(item: any) {
    if (item) {
      this.pessoaParaEdicao = item;

      this.pessoaForm.controls.id.setValue(this.pessoaParaEdicao.id);
      this.pessoaForm.controls.nome.setValue(this.pessoaParaEdicao.nome);
      this.pessoaForm.controls.cpf.setValue(this.pessoaParaEdicao.cpf);
      this.pessoaForm.controls.email.setValue(this.pessoaParaEdicao.email);
      this.pessoaForm.controls.nascimento.setValue(
                                        this.pessoaParaEdicao.dataNascimento.format('yyyy-MM-DD'));
    } else {
      this.pessoaParaEdicao = null;
      this.pessoaForm.reset();
    }
  }

  setPessoaParaExclusao(item: any) {
    this.pessoaParaExclusao = item;
  }

  setFoto(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.pessoaForm.controls.foto.setValue(file);
    }
  }

  mostrarFoto(item) {
    swal.fire({
      title: item.nome,
      imageUrl: `${this.urlEndPoint}/foto/${item.id}`,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Foto ${item.nome}',
    })
  }

  popularTabela(content: any[], totalElements: number) {
    content.forEach((c) => {
      c['dataNascimento'] = moment(c['dataNascimento']);
    })

    this.dataSource = new MatTableDataSource<any>(content);
    this.paginator.length = totalElements;
  }

  public carregarPaginaUsuarios(event: PageEvent): PageEvent {
    this.pageSize = event.pageSize;
    this.findAll(event.pageIndex, event.pageSize);
    return event;
  }

  tabelaEstaVazia(): boolean {
    if (this.dataSource) {
      return this.dataSource.data.length == 0;
    }

    return true;
  }

  private getRangeLabel(page: number, pageSize: number, length: number) {
    if (length == 0 || pageSize == 0) { 
        return `0 de ${length}`;
    } 

    length = Math.max(length, 0); 
    const startIndex = page * pageSize; 
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : 
                                            startIndex + pageSize; 

    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }

  private toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

}
