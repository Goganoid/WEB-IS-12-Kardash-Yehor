using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using MyPlan.Entities;
using MyPlan.Helpers;
using MyPlan.Hubs;
using MyPlan.Models;
using MyPlan.Models.Card;
using MyPlan.Repositories;
using MyPlan.Services;

namespace MyPlan.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CardController : ControllerBase
    {
        private IRepositoryManager _repositoryManager;
        private ICardService _cardService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly IHubContext<DashboardHub,IDashboardClient> _hubContext;

        public CardController(
            IRepositoryManager repositoryManager,
            ICardService cardService,
            IMapper mapper,
            IOptions<AppSettings> appSettings, IHubContext<DashboardHub, IDashboardClient> hubContext)
        {
            _cardService = cardService;
            _repositoryManager = repositoryManager;
            _mapper = mapper;
            _hubContext = hubContext;
            _appSettings = appSettings.Value;
        }
        [Authorize]
        [HttpPost("create/{columnId:int}")]
        public async Task<IActionResult> CreateCard([FromBody] CardContentModel contentModel, int columnId)
        {
            var card = _mapper.Map<Card>(contentModel);
            var userId = int.Parse(HttpContext.User.Identity.Name);

            try
            {
                card = _cardService.CreateCard(card,columnId, userId);
                var cardDTO = _mapper.Map<CardDTO>(card);
                var dashboardId = _repositoryManager.Column.GetById(columnId).DashboardId;
                await _hubContext.Clients.Group(dashboardId.ToString()).ReceiveMessage("create card");
                return Ok(cardDTO);
            }
            catch (AppException ex)
            {
                return BadRequest(ex.Message);
            }
            
        }
        [HttpPut("update/content/{cardId:int}")]
        public async Task<IActionResult> UpdateCardContent([FromBody] CardContentModel model,int cardId)
        {
            var card = _mapper.Map<Card>(model);
            var userId = int.Parse(HttpContext.User.Identity.Name);
            try
            {
                _cardService.UpdateCardContent(card, cardId, userId);
                var dashboardId = _repositoryManager.Card.GetById(cardId).Column.DashboardId;
                await _hubContext.Clients.Group(dashboardId.ToString()).ReceiveMessage("update card content");
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("update/position/{cardId:int}")]
        public async Task<IActionResult> UpdateCardPosition([FromBody] CardPositionModel model,int cardId)
        {
            var userId = int.Parse(HttpContext.User.Identity.Name);
            try
            {
                _cardService.UpdateCardPosition(model, cardId, userId);
                var dashboardId = _repositoryManager.Card.GetById(cardId).Column.DashboardId;
                await _hubContext.Clients.Group(dashboardId.ToString()).ReceiveMessage("update card position");
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize]
        [HttpDelete("delete/{cardId:int}")]
        public async Task<IActionResult> DeleteCard(int cardId)
        {
            var userId = int.Parse(HttpContext.User.Identity.Name);
            try
            {
                _cardService.DeleteCard(cardId, userId);
                var dashboardId = _repositoryManager.Card.GetById(cardId).Column.DashboardId;
                await _hubContext.Clients.Group(dashboardId.ToString()).ReceiveMessage("delete card");
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        }
}
