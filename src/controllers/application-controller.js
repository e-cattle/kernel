'use strict'

const applicationRepository = require('../repositories/application-repository')
const applicationAuth = require('../auth/application-auth')

const GeneralValidator = require('../validators/general-validator')

async function validate (app) {
  try {
    const generalValidator = new GeneralValidator()

    generalValidator.hasMinLen(app.name, 3, 'O nome (name) deve conter pelo menos 3 caracteres!')
    generalValidator.hasMinLen(app.description, 3, 'A descrição (description) deve conter pelo menos 3 caracteres!')
    generalValidator.hasMinLen(app.user, 3, 'O nome do usuário deve conter pelo menos 3 caracteres!')
    generalValidator.isRequired(app.email, 'Informe um e-mail válido para o usuário!')
    generalValidator.isEmail(app.email, 'Informe um e-mail válido para o usuário!')
    generalValidator.isRequired(app.picture, 'Informe uma foto de perfil válida para o usuário!')

    if (!generalValidator.isValid()) {
      return generalValidator.errors()
    }

    return
  } catch (err) {
    console.log(err)

    return 'Houve um erro no tratamento da requisição! Por favor, contacte o suporte.'
  }
}

// Cadastra um novo aplicativo
exports.create = async (req, res, next) => {
  try {
    const app = req.body

    // Validação
    const errors = await validate(app)

    if (errors) {
      res.status(401).json({ message: errors })

      return
    }

    app.code = undefined
    app.enable = true
    app.backup = false
    app.cleanup = false
    app.created = undefined
    app.changed = undefined

    // Cadastra o aplicativo
    const newApp = await applicationRepository.create(app)

    // Geração do Token
    // Gera o token valido para o dispositivo
    const token = await applicationAuth.generateToken({
      date: newApp.changed,
      code: newApp.code
    })

    // Envia o novo token para o dispositivo
    res.status(201).send({
      token: token
    })

    return
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}

exports.modify = async (req, res, next) => {
  try {
    const app = req.body

    // Validação
    const errors = await validate(app)

    if (errors) {
      res.status(401).json({ message: errors })

      return
    }

    if (!req.code || req.code.length <= 0) {
      res.status(401).json({ message: 'A chave privada de autenticação (token) é inválida! Ela não contém o identificador do aplicativo.' })

      return
    }

    app.code = req.code
    delete app.enable
    delete app.backup
    delete app.cleanup
    delete app.created
    app.changed = Date.now()

    // Cadastra o aplicativo
    const newApp = await applicationRepository.save(app)

    // Geração do Token
    // Gera o token valido para o dispositivo
    const token = await applicationAuth.generateToken({
      date: newApp.changed,
      code: newApp.code
    })

    // Envia o novo token para o dispositivo
    res.status(200).send({
      token: token
    })

    return
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}

exports.all = async (req, res, next) => {
  try {
    const applications = await applicationRepository.getAll()

    if (!applications) {
      res.status(404).send({ message: 'Aplicativos não encontrados!' })
      return
    }

    res.status(200).send(applications)
  } catch (e) {
    res.status(500).send({ message: 'Falha na requisição!', data: e })
  }
}

exports.enable = async (req, res, next) => {
  if (!req.params._id) {
    res.status(401).json({ message: 'ID não fornecido!' })
    return
  }

  try {
    const id = req.params._id

    const application = await applicationRepository.enableById(id)

    if (!application) {
      res.status(404).json({ message: 'App não encontrada!' })

      return
    }

    res.status(200).json(application)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}

exports.disable = async (req, res, next) => {
  if (!req.params._id) {
    res.status(401).json({ message: 'ID não fornecido!' })
    return
  }

  try {
    const id = req.params._id

    const application = await applicationRepository.disableById(id)

    if (!application) {
      res.status(404).json({ message: 'App não encontrada!' })
      return
    }

    res.status(200).json(application)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}

exports.remove = async (req, res, next) => {
  if (!req.params._id) {
    res.status(401).json({ message: 'ID não fornecido!' })
    return
  }

  try {
    const id = req.params._id

    const application = await applicationRepository.removeById(id)

    if (!application) {
      res.status(404).json({ message: 'App não encontrada!' })
      return
    }

    res.status(200).json(application)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}

exports.backup = async (req, res, next) => {
  if (!req.params._id || !req.params.state) {
    res.status(401).json({ message: 'ID e/ou novo estado não fornecido!' })
    return
  }

  try {
    const id = req.params._id
    const state = (req.params.state === 'enable')

    const application = await applicationRepository.changeBackupById(id, state)

    if (!application) {
      res.status(404).json({ message: 'Aplicativo não encontrado!' })

      return
    }

    res.status(200).json({})
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}

exports.cleanup = async (req, res, next) => {
  if (!req.params._id || !req.params.state) {
    res.status(401).json({ message: 'ID e/ou novo estado não fornecido!' })
    return
  }

  try {
    const id = req.params._id
    const state = (req.params.state === 'enable')

    const application = await applicationRepository.changeCleanUpById(id, state)

    if (!application) {
      res.status(404).json({ message: 'Aplicativo não encontrado!' })

      return
    }

    res.status(200).json({})
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}
