import questions from './questions.js'

let timeInterval;
let progressInterval;

class Quiz {
    constructor(questions){
        this.questions=questions
        this.index = 0
        this.question = this.getQuestion()
        this.ui = {
           time: document.querySelector('#time'),
           progress: document.querySelector('#progress'),
           title: document.querySelector('#title'),
           answers: document.querySelector('#answers'),
           currentQuestion: document.querySelector('#currentQuestion'), 
           totalQuestion: document.querySelector('#totalQuestion'),
           next: document.querySelector('#next'),
           quiz: document.querySelector('#quiz'),
           finish: document.querySelector('#finish'),
           correctAnswer: document.querySelector('#correctAnswer'),
           errorAnswer: document.querySelector('#errorAnswer'),
           noneAnswer: document.querySelector('#noneAnswer'),
           refreshQuiz: document.querySelector('#refreshQuiz')
        }

         this.answer = {
            correct:0,
            error:0,
            none:0
         }

        this.ui.totalQuestion.innerHTML = this.questions.length
        this.ui.currentQuestion.innerHTML = this.index+1
    }
    getQuestion (){
        return this.questions[this.index]
    }

    createAnswer(variant,answer){
      return `
        <div 
        data-variant ="${variant}"
        class="px-[12px] py-[9px] border rounded-lg cursor-pointer">
            <b>${variant}.</b>${answer}
        </div>
        `
    }

    createQuestion(){
       this.ui.title.innerHTML= `<b>${this.index+1}</b>.${this.question.text}`
       this.ui.answers.innerHTML = ''

       for(let variant of Object.keys(this.question.options)){
        this.ui.answers.innerHTML += this.createAnswer(variant,this.question.options[variant]) 
       }
    }
    nextEvent(){
        this.ui.next.addEventListener('click',()=>{
            this.ui.next.classList.add('hidden')
            this.ui.answers.style.pointerEvents = 'initial'
            if(this.index < this.questions.length -1){
            this.index++;
            this.question=this.getQuestion()
            this.createQuestion()
            }
            this.ui.currentQuestion.innerHTML = this.index+1
            this.ui.time.innerHTML = 10
            this.time(10)
            this.progress(0)
        })
    }

    checkVariant (variant, system = false){
    const clickElement =this.ui.answers.querySelector(`[data-variant ="${variant}"]`)
    const currentElement = this.ui.answers.querySelector(`[data-variant ="${this.question.current}"]`)
   
    this.ui.answers.style.pointerEvents = 'none'

     if(this.question.current === variant){
      clickElement.classList.add('bg-[#d4ffba]')

      if(system){
         this.answer.none++;
      }
      else{
         this.answer.correct++;
      }
     }
     else{
        clickElement.classList.add('bg-[#ffdede]')
        currentElement.classList.add('bg-[#d4ffba]')
        this.answer.error++;
     }
     if(this.index < this.questions.length-1){
        this.ui.next.classList.remove('hidden')
     }
     else{
        this.finish()
     }
    }

    answerEvent(){
     this.ui.answers.addEventListener('click',(e)=>{
        const variant = e.target.getAttribute('data-variant')
        if(variant){
        clearInterval(timeInterval)
        clearInterval(progressInterval)
        this.checkVariant(variant)
        }
     })
    }

    time(time){
       timeInterval= setInterval(timer,1000)
        const obj=this
        function timer(){
          time--;
          obj.ui.time.innerHTML=time
          if(time < 1){
            obj.checkVariant(obj.question.current,true)
            clearInterval(timeInterval)
          }
        }
    }

    progress(width){
      progressInterval =setInterval(timer,100)
      const obj = this
      function timer(){
         width +=1;
         obj.ui.progress.style.width=width + '%'

         if(width === 100){
         clearInterval(progressInterval)
         }
      }
    }

    finish(){
      this.ui.quiz.classList.add('hidden')
      this.ui.finish.classList.remove('hidden')
      this.ui.correctAnswer.innerHTML = this.answer.correct
      this.ui.errorAnswer.innerHTML = this.answer.error
      this.ui.noneAnswer.innerHTML = this.answer.none
    }
    refresh(){
      this.ui.refreshQuiz.addEventListener('click',()=>{
         window.location.reload()
      })
    }
    start (){
      this.createQuestion()
      this.nextEvent()
      this.answerEvent()
      this.time(10)
      this.progress(0)
    }
}
const quiz =new Quiz(questions)

quiz.start()
quiz.refresh()
