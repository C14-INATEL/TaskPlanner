from database.database import db

class Task(db.Model):
    __tablename__ = 'tasks' #nome da tabela no banco de dados

    id = db.Column(db.Integer, primary_key=True) #coluna id, do tipo inteiro, é a chave primária da tabela
    title = db.Column(db.String(100), nullable=False) #coluna title, do tipo string, com tamanho máximo de 100 caracteres, não pode ser nula
    description = db.Column(db.String(255)) #coluna description, do tipo string, com tamanho máximo de 255 caracteres, pode ser nula
    status = db.Column(db.String(50), default='A Fazer') #coluna status, do tipo string, com valor padrão 'A Fazer'

    def to_dict(self): #método para converter o objeto Task em um dicionário, facilitando a serialização para JSON  
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status
        }